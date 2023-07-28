module.exports = {
    'env': {
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        'react'
    ],
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    'rules': {
        'quotes': ['error', 'single'],
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-children-prop': 'off'
    }
}
