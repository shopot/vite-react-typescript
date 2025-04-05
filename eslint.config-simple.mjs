/* eslint-disable func-style */
import eslint from '@eslint/js';
import stylisticJS from '@stylistic/eslint-plugin-js';
import stylisticJSX from '@stylistic/eslint-plugin-jsx';
import stylisticTS from '@stylistic/eslint-plugin-ts';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/*
  https://eslint.org/docs/latest/use/configure/rules
  "off" or 0 - turn the rule off
  "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
  "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
*/

const OFF = 0;
const WARN = 1;
const ERROR = 2;
const NO_ACCESS_MODIFIER = 'There is no need to limit developer access to properties.';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Этот должно быть здесь в отдельном объекте, чтобы применяться глобально
  { ignores: ['build', 'dist', 'coverage', 'eslint.config.*', 'vite.*', 'stylelint.config.*'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
      // https://github.com/import-js/eslint-import-resolver-typescript#configuration
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json',
        },
        node: true,
      },
      'import/ignore': 'node_modules', // Temporary fix https://github.com/typescript-eslint/typescript-eslint/issues/9450
      'import/extensions': ['error', { json: 'always' }],
      // start eslint-import-resolver-typescript
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true, // eslint-plugin-react
        },
        jsxPragma: null, // @typescript/eslint-parser
      },
    },
  },
  eslint.configs.recommended,
  reactRefresh.configs.vite,
  reactPlugin.configs.flat.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  perfectionist.configs['recommended-natural'],
  {
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@stylistic/js': stylisticJS,
      '@stylistic/ts': stylisticTS,
      '@stylistic/jsx': stylisticJSX,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...tsNamingConventionRule(),
      ...importRules(),
      ...sortRules(),
      ...stylisticRules(),
      ...commonRules(),
    },
  },
];

function commonRules() {
  return {
    'no-console': OFF,
    // React rules
    'react/prop-types': OFF,
    'react/display-name': OFF,
    'react/jsx-uses-react': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/require-default-props': OFF,
    'react/jsx-props-no-spreading': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
    // Typescript rules
    '@typescript-eslint/consistent-type-definitions': [ERROR, 'type'],
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/consistent-type-exports': OFF,
    '@typescript-eslint/no-unsafe-assignment': OFF,
    '@typescript-eslint/no-unsafe-call': OFF,
    '@typescript-eslint/no-unsafe-member-access': OFF,
    '@typescript-eslint/no-unsafe-return': OFF,
    '@typescript-eslint/sort-type-constituents': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-empty-function': OFF,
  };
}

function tsNamingConventionRule() {
  return {
    '@typescript-eslint/naming-convention': [
      ERROR,
      {
        selector: 'default',
        format: ['strictCamelCase', 'StrictPascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'import',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'variable',
        format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'],
        modifiers: ['const'],
        types: ['boolean', 'string', 'number'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should', 'can', 'did', 'will'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: null,
      },
      {
        selector: 'objectLiteralProperty',
        format: null,
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'parameter',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'typeProperty',
        format: ['strictCamelCase', 'UPPER_CASE'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'enumMember',
        format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
    ],
  };
}

function importRules() {
  return {
    'no-restricted-imports': [
      ERROR,
      {
        patterns: [
          {
            group: [
              'app/*/**',
              'assets/*/*/**',
              'core/*/*/**',
              'modules/*/**',
              'features/*/**',
              'types/*/**',
              '@/app/*/**',
              '@/assets/*/*/**',
              '@/core/*/*/**',
              '@/modules/*/**',
              '@/features/*/**',
              '@/types/*/**',
            ],
            message: 'Direct access to the internal parts of the module is prohibited',
          },
        ],
      },
    ],
  };
}

function sortRules() {
  return {
    'perfectionist/sort-enums': OFF,
    'perfectionist/sort-jsx-props': [
      WARN,
      {
        customGroups: {
          key: ['^key$', '^keys$'],
          id: ['^id$', '^name$', '^testId$', '^data-testid$', '^data-autotest$'],
          accessibility: ['^title$', '^alt$', '^placeholder$', '^label$', '^description$', '^fallback$'],
          callback: ['^on.+', '^handle.+'],
          className: ['^className$', '^class$', '^style$'],
          control: ['^asChild$', '^as$'],
          data: ['^data-*', '^aria-*'],
          ref: ['^ref$', '^innerRef$'],
          state: [
            '^value$',
            '^checked$',
            '^selected$',
            '^open$',
            '^defaultValue$',
            '^defaultChecked$',
            '^defaultOpen$',
            '^disabled$',
            '^required$',
            '^readOnly$',
            '^loading$',
            '^(is|has|should|can|did|will).+',
          ],
          variant: ['^variant$', '^size$', '^orientation$', '^color$'],
        },
        groups: [
          'id',
          'key',
          'ref',
          'control',
          'variant',
          'className',
          'state',
          'callback',
          'accessibility',
          'data',
          'unknown',
          'shorthand',
          'multiline',
        ],
        type: 'natural',
      },
    ],
    'perfectionist/sort-imports': [
      ERROR,
      {
        type: 'alphabetical',
        order: 'asc',
        fallbackSort: { type: 'unsorted' },
        ignoreCase: true,
        specialCharacters: 'keep',
        internalPattern: ['^@\/.+'],
        partitionByComment: false,
        partitionByNewLine: false,
        newlinesBetween: 'always',
        maxLineLength: undefined,
        groups: [
          'react',
          ['builtin', 'external', 'type'],
          ['internal', 'internal-type'],
          ['parent-type', 'sibling-type', 'index-type', 'parent', 'sibling', 'index'],
          'side-effect',
          'style',
          'object',
          'unknown',
        ],
        customGroups: {
          value: {
            react: ['^react$', '^react-.+'],
          },
          type: {
            react: ['^react$', '^react-.+'],
          },
        },
        environment: 'node',
      },
    ],
  };
}

function stylisticRules() {
  return {
    // js
    '@stylistic/js/spaced-comment': [
      ERROR,
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+', '*'],
        },
        block: {
          balanced: true,
        },
      },
    ],
    // ts
    '@stylistic/ts/padding-line-between-statements': [
      ERROR,
      {
        blankLine: 'always',
        prev: ['const', 'let', 'case', 'default', 'block', 'block-like', 'multiline-block-like', 'interface', 'type'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let'],
        next: ['const', 'let'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['switch', 'while', 'try', 'return', 'if', 'interface', 'type'],
      },
    ],
    // React
    '@stylistic/jsx/jsx-pascal-case': ERROR,
    '@stylistic/jsx/jsx-sort-props': OFF,
  };
}
