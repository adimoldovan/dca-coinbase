require('dotenv').config();
const CoinbasePro = require('coinbase-pro');
const yargs = require('yargs');
const reporter = require('./reporter.js');
const {
	API_URL,
	CB_KEY,
	CB_SECRET,
	CB_PASSPHRASE,
	AMOUNT
} = process.env;
const client = new CoinbasePro.AuthenticatedClient(
	CB_KEY,
	CB_SECRET,
	CB_PASSPHRASE,
	API_URL
);

const SLACK = (process.env.SLACK_TOKEN && process.env.SLACK_CHANNEL);

// eslint-disable-next-line no-unused-expressions
yargs
	.usage('Usage: $0 <cmd>')
	.demandCommand(1, 1)
	.command(
		[ 'hello', '$0' ],
		'Says hello, confirms everything is working ok',
		() => { },
		async () => await hello()
	)
	.command(
		'buy <base> <quote> <amount> [max_price]',
		'Buys the specified currency if all conditions are met',
		() => { },
		async (argv) => {
			const r = await trade(argv.base, argv.quote, argv.amount, argv.max_price);
			console.log(r);
			if (SLACK) {
				reporter.sendSimpleMessage(r);
			}

		}
	)
	.help('h')
	.alias('h', 'help').argv;

function validateVars() {
	const vars = [ 'API_URL', 'CB_KEY', 'CB_SECRET', 'CB_PASSPHRASE' ];
	const errors = [];

	for (const varName of vars) {
		if (!process.env[varName]) {
			errors.push(`${varName} is undefined!`);
		}
	}

	if (errors.length > 0) {
		throw new Error(errors.join('\n'));
	}
}

async function hello() {
	validateVars();
	await printBalance();
}

async function printBalance() {
	try {
		const accounts = await client.getAccounts();
		const balance = [];
		const slackMsgLines = [];

		for (const acc of accounts) {
			// prettyPrint(acc);
			if (acc.balance > 0) {
				balance.push({ 'Currency': acc.currency, 'Balance': acc.balance, 'Available': acc.balance });
				slackMsgLines.push(`${acc.currency} \t ${acc.balance}`);
			}
		}

		console.table(balance);

		if (SLACK) {
			slackMsgLines.splice(0, 0, 'Balance:');
			await reporter.sendSimpleMessage(slackMsgLines.join('\n'));
		}

	} catch (error) {
		console.error(error);
	}
}

async function trade(baseCurrency, quoteCurrency, amount, maxPrice) {
	await printBalance();

	try {
		const productId = `${baseCurrency}-${quoteCurrency}`;

		const baseAccount = (await client.getAccounts()).filter( (a) => {
			return a.currency === baseCurrency;
		})[0];

		prettyPrint(baseAccount);

		const quoteAccount = (await client.getAccounts()).filter( (a) => {
			return a.currency === quoteCurrency;
		})[0];

		prettyPrint(quoteAccount);

		if (quoteAccount.balance < amount) {
			const msg =`Insufficient balance! (found ${quoteAccount.balance}, needed ${AMOUNT})`;
			console.error(msg);
			return msg;
		}

		if (maxPrice) {
			const product24Stats = await client.getProduct24HrStats(productId);
			prettyPrint(product24Stats);

			if (product24Stats.last > maxPrice) {
				const msg = `Price too high! (${product24Stats.last}). Expecting < ${maxPrice}`;
				console.error(msg);
				return msg;
			}
		}

		const buyParams = {
			product_id: productId,
			type: 'market',
			side: 'buy',
			funds: amount
		};

		prettyPrint(buyParams);

		const response = await client.buy(buyParams);
		prettyPrint(response);

		const order = await client.getOrder(response.id);
		prettyPrint(order);

		return `Bought ${amount} ${quoteCurrency} worth of ${baseCurrency}`;

	} catch (error) {
		console.error(error);
	}
}

function prettyPrint(object) {
	console.log(JSON.stringify(object, null, 2));
}

