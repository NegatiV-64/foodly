module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prefer-const': 'error',
    'eqeqeq': 'error',
    'default-case': 'error',
    'prefer-template': 'error',
    'no-undef-init': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
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
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      overrides: {
        constructors: "no-public",
        properties: "off",
      }
    }]
  },
};
