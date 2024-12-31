import pluginJs from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  reactRefresh.configs.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  prettierRecommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      // Base Warnings
      'no-console': 'warn',

      // Formatting
      'prettier/prettier': [
        'error',
        {
          semi: true,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          bracketSpacing: true,
          useTabs: false,
        },
      ],

      // TypeScript
      '@typescript-eslint/no-unused-vars': 'error',
    },
    ignores: ['*.cjs', '*.js', '*.d.ts', 'node_modules/', 'public/', 'build/', 'dist/', 'coverage/', 'docker/'],
  },
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...hooksPlugin.configs.recommended.rules,
    },
    ignores: ['*.test.tsx'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      'jsx-a11y/alt-text': 'error',
    },
  },
  {
    plugins: {
      import: importPlugin,
      rules: {
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            groups: ['builtin', 'external', 'internal', 'unknown', ['sibling', 'parent'], 'index', 'object'],
            pathGroupsExcludedImportTypes: ['builtin'],
            pathGroups: [
              { pattern: 'react', group: 'builtin' },
              { pattern: 'react-dom/client', group: 'builtin' },
              { pattern: 'react-router-dom', group: 'builtin' },
              /** React Modules */
              { pattern: 'app', group: 'internal' },
              { pattern: 'assets', group: 'internal' },
              { pattern: 'core', group: 'internal' },
              { pattern: 'modules', group: 'internal' },
              { pattern: 'features', group: 'internal' },
              { pattern: 'types', group: 'internal' },
              { pattern: 'app/**', group: 'internal' },
              { pattern: 'assets/**', group: 'internal' },
              { pattern: 'core/**', group: 'internal' },
              { pattern: 'modules/**', group: 'internal' },
              { pattern: 'features/**', group: 'internal' },
              { pattern: 'types/**', group: 'internal' },
              //---
              {
                pattern: './*.scss',
                group: 'sibling',
                position: 'after',
              },
            ],
          },
        ],
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['app/*/**', 'assets/*/*/**', 'core/*/*/**', 'modules/*/**', 'features/**', 'types/*/**'],
                message: 'Direct access to the internal parts of the module is prohibited',
              },
            ],
          },
        ],
      },
    },
  },
];
