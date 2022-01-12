const { overrides, rules } = require('./.eslintrc.base.cjs')

/**
 * @file ESLint Configuration - Root
 * @see https://eslint.org/docs/user-guide/configuring
 */

const RULES_NO_UNDEFINED_TYPES = rules['jsdoc/no-undefined-types']
const RULES_SPELLCHECKER = rules['spellcheck/spell-checker']

module.exports = {
  root: true,
  extends: ['./.eslintrc.base.cjs'],
  rules: {
    'jsdoc/no-undefined-types': [
      RULES_NO_UNDEFINED_TYPES[0],
      {
        definedTypes: [
          ...RULES_NO_UNDEFINED_TYPES[1].definedTypes,
          'BufferEncoding'
        ]
      }
    ],
    'spellcheck/spell-checker': [
      RULES_SPELLCHECKER[0],
      {
        ...RULES_SPELLCHECKER[1],
        skipWords: [
          ...RULES_SPELLCHECKER[1].skipWords,
          'authed',
          'dao',
          'datetime',
          'doppler',
          'dto',
          'dtos',
          'enums',
          'foofoobaby',
          'healthchecks',
          'keyof',
          'localhost',
          'lowercased',
          'matcher',
          'matchers',
          'mysql',
          'nestjs',
          'nullish',
          'nginx',
          'openapi',
          'passwordless',
          'plaintext',
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
      files: [
        '*.openapi.ts',
        'ecosystem.config.cjs',
        'src/hooks/use-swagger.hook.ts'
      ],
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
