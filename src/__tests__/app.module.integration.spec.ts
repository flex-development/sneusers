import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { EnvironmentVariables } from '@sneusers/models'
import createApp from '@tests/utils/create-app.util'
import type { Testcase } from '@tests/utils/types'
import TestSubject from '../app.module'

/**
 * @file Integration Tests - AppModule
 * @module sneusers/tests/integration/AppModule
 */

describe('integration:AppModule', () => {
  let app: NestExpressApplication

  before(async () => {
    const ntapp = await createApp({ imports: [TestSubject] })
    app = await ntapp.app.init()
  })

  after(async () => {
    await app.close()
  })

  describe('ConfigModule', () => {
    let config: ConfigService<EnvironmentVariables, true>

    before(() => {
      config = app.get<typeof config>(ConfigService)
    })

    describe('app.get(ConfigService).get', () => {
      type Case = Testcase<'boolean' | 'number' | 'string'> & {
        type?: 'AppEnv' | 'NodeEnv'
        variable: keyof EnvironmentVariables
      }

      const cases: Case[] = [
        { expected: 'string', type: 'AppEnv', variable: 'APP_ENV' },
        { expected: 'number', variable: 'CACHE_MAX' },
        { expected: 'number', variable: 'CACHE_TTL' },
        { expected: 'string', variable: 'COOKIE_SECRET' },
        { expected: 'number', variable: 'CSURF_COOKIE_MAX_AGE' },
        { expected: 'boolean', variable: 'DB_AUTO_LOAD_MODELS' },
        { expected: 'string', variable: 'DB_HOST' },
        { expected: 'boolean', variable: 'DB_LOG_QUERY_PARAMS' },
        { expected: 'string', variable: 'DB_NAME' },
        { expected: 'string', variable: 'DB_PASSWORD' },
        { expected: 'number', variable: 'DB_PORT' },
        { expected: 'number', variable: 'DB_RETRY_ATTEMPTS' },
        { expected: 'number', variable: 'DB_RETRY_DELAY' },
        { expected: 'boolean', variable: 'DB_SYNC_ALTER' },
        { expected: 'boolean', variable: 'DB_SYNC_FORCE' },
        { expected: 'boolean', variable: 'DB_SYNCHRONIZE' },
        { expected: 'string', variable: 'DB_TIMEZONE' },
        { expected: 'string', variable: 'DB_USERNAME' },
        { expected: 'boolean', variable: 'DEV' },
        { expected: 'string', variable: 'EMAIL_CLIENT' },
        { expected: 'string', variable: 'EMAIL_HOST' },
        { expected: 'number', variable: 'EMAIL_PORT' },
        { expected: 'string', variable: 'EMAIL_PRIVATE_KEY' },
        { expected: 'string', variable: 'EMAIL_SEND_AS' },
        { expected: 'string', variable: 'EMAIL_USER' },
        { expected: 'string', variable: 'HOST' },
        { expected: 'string', variable: 'HOSTNAME' },
        { expected: 'number', variable: 'JWT_EXP_ACCESS' },
        { expected: 'number', variable: 'JWT_EXP_REFRESH' },
        { expected: 'number', variable: 'JWT_EXP_VERIFICATION' },
        { expected: 'string', variable: 'JWT_SECRET_ACCESS' },
        { expected: 'string', variable: 'JWT_SECRET_REFRESH' },
        { expected: 'string', variable: 'JWT_SECRET_VERIFICATION' },
        { expected: 'string', type: 'NodeEnv', variable: 'NODE_ENV' },
        { expected: 'number', variable: 'PORT' },
        { expected: 'boolean', variable: 'PROD' },
        { expected: 'string', variable: 'REDIS_HOST' },
        { expected: 'string', variable: 'REDIS_PASSWORD' },
        { expected: 'number', variable: 'REDIS_PORT' },
        { expected: 'string', variable: 'REDIS_USER' },
        { expected: 'string', variable: 'SERVER_DESCRIP_DEV' },
        { expected: 'string', variable: 'SERVER_DESCRIP_PROD' },
        { expected: 'string', variable: 'SERVER_URL' },
        { expected: 'string', variable: 'SERVER_URL_DEV' },
        { expected: 'string', variable: 'SERVER_URL_PROD' },
        { expected: 'string', variable: 'SERVER_URL_STG' },
        { expected: 'boolean', variable: 'STG' },
        { expected: 'boolean', variable: 'TEST' },
        { expected: 'number', variable: 'THROTTLE_LIMIT' },
        { expected: 'number', variable: 'THROTTLE_TTL' },
        { expected: 'string', variable: 'TLD' }
      ]

      cases.forEach(({ expected, type = expected, variable }) => {
        it(`should return a ${type} given ['${variable}']`, () => {
          expect(config.get(variable)).to.be.a(expected)
        })
      })
    })
  })
})
