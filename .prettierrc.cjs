/**
 * @file Prettier Configuration
 * @see https://prettier.io/docs/en/configuration.html
 * @see https://prettier.io/docs/en/options.html
 * @see https://github.com/rx-ts/prettier/tree/master/packages/sh
 */

module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  printWidth: 80,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  overrides: [
    {
      files: ['*.hbs'],
      options: {
        parser: 'html'
      }
    },
    {
      files: [
        '*.sh',
        '.husky/commit-msg',
        '.husky/pre-commit',
        '.husky/pre-push'
      ],
      options: {
        functionNextLine: true,
        indent: 2,
        keepComments: true,
        keepPadding: false,
        parser: 'sh',
        spaceRedirects: true,
        switchCaseIndent: true,
        variant: 0
      }
    }
  ]
}
