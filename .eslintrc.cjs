module.exports = {
    env: { node: true, es2021: true },
    parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'prettier'
    ],
    rules: {
        'import/order': [
            'warn',
            { 'newlines-between': 'always', 'alphabetize': { order: 'asc' } }
        ]
    }
}