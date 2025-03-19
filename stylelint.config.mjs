/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  customSyntax: 'postcss-scss',
  ignoreFiles: ['dist/**/*'],
  rules: {
    'no-descending-specificity': null,
    'block-no-empty': null,
    'color-hex-length': 'long',
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box'],
      },
    ],
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export'],
      },
    ],
    'declaration-empty-line-before': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/at-mixin-pattern': null,
  },
};
