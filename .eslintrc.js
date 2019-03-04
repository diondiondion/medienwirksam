module.exports = {
	env: {
		browser: true,
		node: true,
	},
	parser: 'babel-eslint',
	plugins: ['prettier', 'react', 'react-hooks'],
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	rules: {
		strict: 0,
		'prettier/prettier': 'error',
		'react/prop-types': [1, {skipUndeclared: true}],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
