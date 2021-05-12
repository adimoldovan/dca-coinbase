module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:node/recommended'
	],
	parserOptions: {
		ecmaVersion: 2021
	},
	rules: {
		'no-unused-expressions': 'error',
		'semi': [ 'error', 'always' ],
		'quotes': [ 'error', 'single' ],
		'indent': [ 'error', 'tab' ],
		'array-bracket-spacing': [ 'error', 'always' ],
		'object-curly-spacing': [ 'error', 'always' ],
		'computed-property-spacing': [ 'warn', 'never' ],
		'comma-spacing': [ 'warn', { 'before': false, 'after': true } ],
		'keyword-spacing': [ 'error', { 'before': true } ],
		'operator-linebreak': [ 'error', 'after' ],
		'max-len': [ 'warn', { 'code': 100, 'tabWidth': 4, 'ignoreStrings': true, 'ignoreTemplateLiterals': true  } ]
	}
};
