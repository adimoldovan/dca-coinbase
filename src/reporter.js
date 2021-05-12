const { ErrorCode, LogLevel, retryPolicies, WebClient } = require('@slack/web-api');
const { SLACK_TOKEN, SLACK_CHANNEL } = process.env;

async function report(blocks) {
	if (!SLACK_TOKEN) {
		throw new Error('SLACK_TOKEN required!');
	}
	if (!SLACK_CHANNEL) {
		throw new Error('SLACK_CHANNEL required!');
	}

	const client = new WebClient(SLACK_TOKEN, {
		logLevel: LogLevel.INFO,
		retryConfig: retryPolicies.fiveRetriesInFiveMinutes
	});

	blocks.push(
		{
			'type': 'divider',
		},
		{
			'type': 'context',
			'elements': [
				{
					'type': 'mrkdwn',
					'text': '<https://pro.coinbase.com|Coinbase Pro>'
				}
			]
		}
	);

	try {
		await client.chat.postMessage(
			{
				blocks,
				channel: SLACK_CHANNEL,
				icon_emoji: ':coin:',
				username: 'Coinbase DCA bot'
			});
	} catch (error) {
		if ([ ErrorCode.PlatformError,
			ErrorCode.RequestError,
			ErrorCode.RateLimitedError,
			ErrorCode.HTTPError ].includes(error.code)) {
			console.log(error.data);
		} else {
			console.log(`ERROR: ${error}`);
		}
	}
}

async function sendSimpleMessage(message) {
	await report([
		{
			type: 'section',
			text: {
				'type': 'mrkdwn',
				'text': message
			}
		}
	]);
}

module.exports = {
	report,
	sendSimpleMessage
};
