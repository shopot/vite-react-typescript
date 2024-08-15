import { fixupPluginRules } from '@eslint/compat';
import eslintJS from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { resolve as tsResolver } from 'eslint-import-resolver-typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

const patchedReactHooksPlugin = fixupPluginRules(eslintPluginReactHooks);
const patchedImportPlugin = fixupPluginRules(eslintPluginImport);

const NO_ACCESS_MODIFIER = 'There is no need to limit developer access to properties.';
const NO_PROP_TYPES = 'No PropTypes. Use Typescript instead.';

const baseESLintConfig = {
  name: 'eslint',
  extends: [eslintJS.configs.recommended],
  rules: {
    /** https://eslint.org/docs/latest/rules/no-constant-binary-expression */
    'no-constant-binary-expression': 'error',

    /** https://eslint.org/docs/latest/rules/no-new-native-nonconstructor */
    'no-new-native-nonconstructor': 'error',

    /** https://eslint.org/docs/latest/rules/no-promise-executor-return */
    'no-promise-executor-return': 'error',

    /** https://eslint.org/docs/latest/rules/no-self-compare */
    'no-self-compare': 'error',

    /** https://eslint.org/docs/latest/rules/no-template-curly-in-string */
    'no-template-curly-in-string': 'error',

    /** https://eslint.org/docs/latest/rules/no-unmodified-loop-condition */
    'no-unmodified-loop-condition': 'error',

    /** https://eslint.org/docs/latest/rules/no-unreachable-loop */
    'no-unreachable-loop': 'error',

    /** https://eslint.org/docs/latest/rules/no-unused-private-class-members */
    'no-unused-private-class-members': 'error',

    /** https://eslint.org/docs/latest/rules/no-use-before-define */
    'no-use-before-define': 'error',

    /** https://eslint.org/docs/latest/rules/require-atomic-updates */
    // 'require-atomic-updates': 'error', // TODO: check it

    /** https://eslint.org/docs/latest/rules/use-isnan */
    camelcase: 'error',

    /** https://eslint.org/docs/latest/rules/no-console */
    'no-console': ['error', { allow: ['warn', 'info', 'error'] }],

    /** https://eslint.org/docs/latest/rules/no-await-in-loop */
    'no-await-in-loop': 'off',

    /** https://eslint.org/docs/latest/rules/no-return-await */
    'no-return-await': 'off',

    /** https://eslint.org/docs/latest/rules/no-else-return */
    'no-else-return': ['error', { allowElseIf: false }],

    /** https://eslint.org/docs/latest/rules/no-unneeded-ternary */
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],

    /** https://eslint.org/docs/latest/rules/no-duplicate-imports */
    'no-duplicate-imports': ['error', { includeExports: true }],

    'no-restricted-syntax': [
      2,
      {
        selector: "Identifier[name='Reflect']",
        message:
          'Avoid the Reflect API. It is a very low-level feature that has only rare and specific use-cases if building complex and hacky libraries. There is no need to use this feature for any kind of normal development',
      },
      {
        selector: "PropertyDefinition[accessibility='public']",
        message: NO_ACCESS_MODIFIER,
      },
      {
        selector: "PropertyDefinition[accessibility='protected']",
        message: NO_ACCESS_MODIFIER,
      },
      {
        selector: "PropertyDefinition[accessibility='private']",
        message: NO_ACCESS_MODIFIER,
      },
      {
        selector: "Identifier[name='PropTypes']",
        message: NO_PROP_TYPES,
      },
      {
        selector: "Identifier[name='propTypes']",
        message: NO_PROP_TYPES,
      },
    ],

    /** https://eslint.org/docs/latest/rules/prefer-destructuring */
    'prefer-destructuring': [
      'error',
      { array: false, object: true },
      { enforceForRenamedProperties: false },
    ],

    /** https://eslint.org/docs/latest/rules/func-style */
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],

    /** https://eslint.org/docs/latest/rules/spaced-comment */
    'spaced-comment': [
      'error',
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

    /** https://eslint.org/docs/latest/rules/array-callback-return */
    'array-callback-return': ['error', { allowImplicit: true, checkForEach: true }],

    /** https://eslint.org/docs/latest/rules/curly */
    curly: ['error', 'all'],

    /** https://eslint.org/docs/latest/rules/padding-line-between-statements */
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],

    /** https://eslint.org/docs/latest/rules/no-multiple-empty-lines */
    'no-multiple-empty-lines': ['error'],

    /** https://eslint.org/docs/latest/rules/arrow-body-style */
    'arrow-body-style': ['error', 'as-needed'],

    /** https://eslint.org/docs/latest/rules/prefer-arrow-callback */
    'prefer-arrow-callback': 'off',

    /** https://eslint.org/docs/latest/rules/no-underscore-dangle */
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id', '__typename', '__schema', '__dirname', '_global'],
        allowAfterThis: true,
      },
    ],
  },
};

const typescriptConfig = {
  name: 'typescript',
  extends: [...typescriptEslint.configs.recommendedTypeChecked],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: 'latest',
      project: './tsconfig.app.json',
    },
    globals: {
      ...globals.builtin,
      ...globals.browser,
      ...globals.es2025,
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: 'error',
  },
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
        overrides: { constructors: 'off' },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      { ignoreArrowShorthand: true, ignoreVoidOperator: true },
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/naming-convention': [
      'error',
      /** Matches the same as class, enum, interface, typeAlias, typeParameter. */
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },

      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: { regex: '^I[A-Z]', match: false },
      },
      /* Boolean variables are prefixed with an allowed verb */
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should', 'can'],
      },
    ],
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    'no-return-await': 'off',
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};

const importConfig = {
  name: 'import',
  plugins: {
    import: patchedImportPlugin,
  },
  rules: {
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/prefer-default-export': 'off',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: false,
        allowObject: true,
      },
    ],
    'import/no-unassigned-import': 'off',
    'import/no-unused-modules': 'error',
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/export': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'asc' },
        pathGroupsExcludedImportTypes: ['react'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
            position: 'after',
          },
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-dom/**', group: 'external', position: 'before' },
          { pattern: 'api/**', group: 'internal', position: 'after' },
          { pattern: 'app/**', group: 'internal', position: 'after' },
          { pattern: 'assets/**', group: 'internal', position: 'after' },
          { pattern: 'components/**', group: 'internal', position: 'after' },
          { pattern: 'config/**', group: 'internal', position: 'after' },
          { pattern: 'contexts/**', group: 'internal', position: 'after' },
          { pattern: 'features/**', group: 'internal', position: 'after' },
          { pattern: 'hooks/**', group: 'internal', position: 'after' },
          { pattern: 'lib/**', group: 'internal', position: 'after' },
          { pattern: 'providers/**', group: 'internal', position: 'after' },
          { pattern: 'routes/**', group: 'internal', position: 'after' },
          { pattern: 'stores/**', group: 'internal', position: 'after' },
          { pattern: 'utils/**', group: 'internal', position: 'after' },
          {
            pattern: '*.(css|sass|less|scss|pcss|style)',
            group: 'index',
            patternOptions: { matchBase: true },
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
            group: [
              'api/*/**',
              'app/*/**',
              'assets/*/*/**',
              'components/*/*/**',
              'config/*/**',
              'contexts/**',
              'features/*/**',
              'hooks/*/**',
              'lib/*/**',
              'providers/**',
              'routes/*/**',
              'store/*/**',
              'stores/*/**',
              'utils/*/**',
            ],
            message: 'Direct access to the internal parts of the module is prohibited',
          },
        ],
      },
    ],
  },
  settings: {
    'import/parsers': {
      espree: ['.js', '.cjs'],
    },
    'import/resolver': {
      typescript: tsResolver,
    },
  },
};

const reactConfig = {
  name: 'react',
  extends: [eslintPluginReact.configs.flat['jsx-runtime']],
  plugins: {
    'react-hooks': patchedReactHooksPlugin,
    'react-refresh': eslintPluginReactRefresh,
  },
  rules: {
    'react/jsx-boolean-value': 'error',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-no-target-blank': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-sort-props': 'off',
    'react/no-unknown-property': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'error',
    ...patchedReactHooksPlugin.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};

const jsxA11yConfig = {
  name: 'jsxA11y',
  ...jsxA11yPlugin.flatConfigs.recommended,
  plugins: {
    'jsx-a11y': jsxA11yPlugin,
  },
  rules: {
    'jsx-a11y/alt-text': ['error', { elements: ['img'], img: ['Image'] }],
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
  },
};

const eslintConfig = typescriptEslint.config(
  baseESLintConfig,
  typescriptConfig,
  eslintConfigPrettier,
  importConfig,
  reactConfig,
  jsxA11yConfig
);

eslintConfig.map((config) => {
  config.files = ['src/**/*.ts', 'src/**/*.tsx'];
  config.ignores = [
    '*.cjs',
    '*.js',
    '*.d.ts',
    'node_modules/',
    'public/',
    'build/',
    'dist/',
    'coverage/',
    'docker/',
    '.idea/',
    '.storybook/',
  ];
});

export default eslintConfig;
