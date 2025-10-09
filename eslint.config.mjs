import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: ['src/components/ui/*'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends('plugin:jsx-a11y/recommended', 'plugin:prettier/recommended', 'next', 'next/core-web-vitals'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]

export default eslintConfig
