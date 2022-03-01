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
          'appleseed',
          'authed',
          'axios',
          'bcc',
          'cacheable',
          'csrf',
          'csurf',
          'ctl',
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
          'genid',
          'gmail',
          'hbs',
          'healthchecks',
          'hsts',
          'ical',
          'impl',
          'initdb',
          'jti',
          'keyof',
          'localhost',
          'lowercased',
          'lowercases',
          'mariadb',
          'matcher',
          'matchers',
          'maxvalue',
          'migrator',
          'minvalue',
          'mssql',
          'mysql',
          'namespaces',
          'nestjs',
          'nextval',
          'nginx',
          'nodemailer',
          'nullable',
          'nullish',
          'oauth',
          'openapi',
          'plaintext',
          'poq',
          'postgre',
          'postgres',
          'psql',
          'pwfile',
          'readonly',
          'redis',
          'req',
          'resave',
          'rowid',
          'scrypt',
          'sequelize',
          'sid',
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
          'umzug',
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
      files: [
        '__tests__/utils/initdb.util.ts',
        'src/models/environment-variables.model.ts',
        'src/modules/db/hooks/before-connect.hook.ts'
      ],
      rules: {
        'unicorn/consistent-function-scoping': 0
      }
    },
    {
      files: ['src/modules/db/providers/umzug-config.service.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        'unicorn/prefer-module': 0
      }
    },
    {
      files: ['src/modules/db/seeders/*create-tokens.ts'],
      rules: {
        'unicorn/no-array-push-push': 0
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
      files: ['src/subdomains/users/entities/user.dao.ts'],
      rules: {
        'unicorn/consistent-function-scoping': 0
      }
    },
    {
      files: ['src/subdomains/users/interceptors/user.interceptor.ts'],
      rules: {
        'prefer-const': 0
      }
    },
    {
      files: ['src/subdomains/users/providers/users.service.ts'],
      rules: {
        'no-prototype-builtins': 0
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
