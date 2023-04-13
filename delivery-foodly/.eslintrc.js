module.exports = {
    root: true,
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'react-native/react-native': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    'overrides': [
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        '@typescript-eslint',
        'react-native'
    ],
    'rules': {
        'prefer-const': 'error',
        'eqeqeq': 'error',
        'default-case': 'error',
        'prefer-template': 'error',
        'no-undef-init': 'warn',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                'multiline': {
                    'delimiter': 'semi',
                    'requireLast': true
                },
                'singleline': {
                    'delimiter': 'semi',
                    'requireLast': false
                },
                'multilineDetection': 'brackets'
            }
        ],
        'semi': 'off',
        '@typescript-eslint/semi': [
            'warn'
        ],
        'quotes': 'off',
        '@typescript-eslint/quotes': [
            'warn',
            'single'
        ],
        '@typescript-eslint/prefer-as-const': 'error',
        'default-param-last': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/default-param-last': 'warn',
        'no-duplicate-imports': 'off',
        '@typescript-eslint/no-duplicate-imports': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                'vars': 'all',
                'args': 'all',
                'ignoreRestSiblings': false,
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }
        ],
        'react/jsx-boolean-value': [
            'warn',
            'always'
        ],
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': [
                    '.tsx',
                    '.ts'
                ]
            }
        ],
        'react/jsx-fragments': [
            'error',
            'element'
        ],
        'react/jsx-pascal-case': [
            'error'
        ],
        'react-native/no-unused-styles': 2,
        'react-native/split-platform-components': 2,
        'react-native/no-inline-styles': 2,
        'react-native/no-color-literals': 2,
        'react-native/no-single-element-style-arrays': 2,
    }
};
