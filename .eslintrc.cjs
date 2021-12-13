const { overrides, rules } = require('./.eslintrc.base.cjs')

/**
 * @file ESLint Configuration - Root
 * @see https://eslint.org/docs/user-guide/configuring
 */

const RULES_NAMING_CONVENTIONS = rules['@typescript-eslint/naming-convention']
const RULES_SPELLCHECKER = rules['spellcheck/spell-checker']

module.exports = {
  root: true,
  extends: ['./.eslintrc.base.cjs'],
  rules: {
    'spellcheck/spell-checker': [
      RULES_SPELLCHECKER[0],
      {
        ...RULES_SPELLCHECKER[1],
        skipWords: [
          ...RULES_SPELLCHECKER[1].skipWords,
          'dtos',
          'enums',
          'localhost',
          'poq',
          'req',
          'sneusers',
          'stringified',
          'subdomain',
          'subdomains',
          'tutils',
          'webpack',
          'zerollup'
        ]
      }
    ]
  },
  overrides: [
    ...overrides,
    {
      files: ['src/**'],
      rules: {
        '@typescript-eslint/naming-convention': [
          RULES_NAMING_CONVENTIONS[0],
          ...RULES_NAMING_CONVENTIONS.slice(1, RULES_NAMING_CONVENTIONS.length),
          {
            selector: 'objectLiteralProperty',
            format: ['UPPER_CASE', 'camelCase', 'snake_case']
          }
        ]
      }
    },
    {
      files: ['src/types/http-exception-json.type.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 0
      }
    },
    {
      files: ['webpack.config.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        'unicorn/prefer-module': 0
      }
    }
  ]
}
