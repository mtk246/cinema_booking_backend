module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [ "eslint:recommended","plugin:node/recommended"],
    "overrides": [
    ],
    
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        'class-methods-use-this': 'off',
        'no-param-reassign': 'off',
        'camelcase': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: 'next' }]
    }
}
