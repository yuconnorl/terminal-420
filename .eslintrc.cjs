/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['simple-import-sort', '@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    'simple-import-sort/imports': 'error', // sorting imports
    'simple-import-sort/exports': 'error', // sorting exports
    '@typescript-eslint/require-await': 'off',
  },
  ignorePatterns: ['**/*.mdx', '**/*.js', '*.mdx', 'src/components/ui/*.tsx'],
}

module.exports = config
