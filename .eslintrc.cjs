const { overrides, rules } = require('./.eslintrc.base.cjs')

/**
 * @file ESLint Configuration - Root
 * @see https://eslint.org/docs/user-guide/configuring
 */

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
          'dao',
          'doppler',
          'dto',
          'dtos',
          'enums',
          'keyof',
          'localhost',
          'mysql',
          'nestjs',
          'poq',
          'readonly',
          'req',
          'sequelize',
          'sneusers',
          'sqlite',
          'stringified',
          'subdomain',
          'subdomains',
          'tutils',
          'uid',
          'webpack',
          'zerollup'
        ]
      }
    ]
  },
  overrides: [
    ...overrides,
    {
      files: ['ecosystem.config.cjs'],
      rules: {
        'sort-keys': 0
      }
    },
    {
      files: ['ecosystem.config.cjs'],
      rules: {
        'sort-keys': 0
      }
    },
    {
      files: [
        'src/middleware/http-logger.middleware.ts',
        'tools/helpers/secrets.ts',
        'webpack.config.ts'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        'unicorn/prefer-module': 0
      }
    },
    {
      files: ['src/subdomains/users/dtos/create-user.dto.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 0
      }
    },
    {
      files: [
        'src/types/http-exception-json.type.ts',
        'tools/helpers/secrets.ts'
      ],
      rules: {
        '@typescript-eslint/naming-convention': 0
      }
    }
  ]
}
