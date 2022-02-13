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
          'BufferEncoding',
          'ChaiHttp'
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
          'axios',
          'bcc',
          'cacheable',
          'csrf',
          'csurf',
          'dao',
          'datetime',
          'dkim',
          'doppler',
          'dto',
          'dtos',
          'embedder',
          'enums',
          'exphbs',
          'foofoobaby',
          'frameguard',
          'gmail',
          'hbs',
          'healthchecks',
          'hsts',
          'ical',
          'impl',
          'jti',
          'keyof',
          'localhost',
          'lowercased',
          'matcher',
          'matchers',
          'mysql',
          'nestjs',
          'nodemailer',
          'nullish',
          'nginx',
          'openapi',
          'passwordless',
          'plaintext',
          'poq',
          'postgres',
          'readonly',
          'redis',
          'req',
          'sequelize',
          'scrypt',
          'smtp',
          'sneusers',
          'sql',
          'sqlite',
          'ssl',
          'strftime',
          'stringified',
          'subclasses',
          'subdomain',
          'subdomains',
          'timestamps',
          'ttl',
          'tutils',
          'ubuntu',
          'uid',
          'unix',
          'upsert',
          'verif',
          'webpack',
          'whoami',
          'xsrf',
          'xss',
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
      files: ['__tests__/utils/create-app.util.ts'],
      rules: {
        'unicorn/prefer-module': 0
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
      files: ['src/models/environment-variables.model.ts'],
      rules: {
        'unicorn/consistent-function-scoping': 0
      }
    },
    {
      files: [
        'src/modules/middleware/middleware.module.ts',
        'src/modules/redis/types/client.type.ts'
      ],
      rules: {
        '@typescript-eslint/ban-types': 0
      }
    },
    {
      files: [
        'src/modules/redis/interfaces/module-options.interface.ts',
        'src/subdomains/users/dtos/create-user.dto.ts'
      ],
      rules: {
        '@typescript-eslint/no-empty-interface': 0
      }
    },
    {
      files: ['src/subdomains/auth/entities/token.dao.ts'],
      rules: {
        eqeqeq: 0
      }
    },
    {
      files: ['src/subdomains/users/interceptors/user.interceptor.ts'],
      rules: {
        'prefer-const': 0
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
