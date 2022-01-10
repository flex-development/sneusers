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
          'datetime',
          'doppler',
          'dto',
          'dtos',
          'enums',
          'foofoobaby',
          'keyof',
          'localhost',
          'matcher',
          'matchers',
          'mysql',
          'nestjs',
          'nullish',
          'nginx',
          'openapi',
          'passwordless',
          'poq',
          'readonly',
          'req',
          'sequelize',
          'sneusers',
          'sql',
          'sqlite',
          'strftime',
          'stringified',
          'subdomain',
          'subdomains',
          'timestamps',
          'tutils',
          'uid',
          'unix',
          'webpack',
          'zerollup'
        ]
      }
    ]
  },
  overrides: [
    ...overrides,
    {
      files: ['*.openapi.ts', 'ecosystem.config.cjs'],
      rules: {
        'sort-keys': 0
      }
    },
    {
      files: ['*.interceptor.ts'],
      rules: {
        'unicorn/no-array-for-each': 0
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
