module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/vue3-essential', '@vue/eslint-config-prettier'],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/multi-word-component-names': 'off',
		indent: 'off',
		'@typescript-eslint/indent': 'off'
	}
}
