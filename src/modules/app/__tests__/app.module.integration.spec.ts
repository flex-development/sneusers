import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { EnvironmentVariables } from '@sneusers/models'
import createApp from '@tests/utils/create-app.util'
import type { Testcase } from '@tests/utils/types'
import TestSubject from '../app.module'

/**
 * @file Integration Tests - AppModule
 * @module sneusers/modules/app/tests/integration/AppModule
 */

describe('integration:modules/AppModule', () => {
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
        type?: 'NodeEnv'
        variable: keyof EnvironmentVariables
      }

      const cases: Case[] = [
        { expected: 'number', variable: 'CACHE_MAX' },
        { expected: 'number', variable: 'CACHE_TTL' },
        { expected: 'boolean', variable: 'DB_AUTO_LOAD_MODELS' },
        { expected: 'string', variable: 'DB_HOST' },
        { expected: 'string', variable: 'DB_NAME' },
        { expected: 'string', variable: 'DB_PASSWORD' },
        { expected: 'number', variable: 'DB_PORT' },
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
        { expected: 'number', variable: 'JWT_EXP_VERIFY' },
        { expected: 'string', variable: 'JWT_SECRET_ACCESS' },
        { expected: 'string', variable: 'JWT_SECRET_REFRESH' },
        { expected: 'string', variable: 'JWT_SECRET_VERIFY' },
        { expected: 'string', type: 'NodeEnv', variable: 'NODE_ENV' },
        { expected: 'number', variable: 'PORT' },
        { expected: 'boolean', variable: 'PROD' },
        { expected: 'boolean', variable: 'PROD_LOCAL' },
        { expected: 'string', variable: 'REDIS_HOST' },
        { expected: 'string', variable: 'REDIS_PASSWORD' },
        { expected: 'number', variable: 'REDIS_PORT' },
        { expected: 'boolean', variable: 'TEST' },
        { expected: 'number', variable: 'THROTTLE_LIMIT' },
        { expected: 'number', variable: 'THROTTLE_TTL' }
      ]

      cases.forEach(({ expected, type = expected, variable }) => {
        it(`should return a ${type} given ['${variable}']`, () => {
          expect(config.get(variable)).to.be.a(expected)
        })
      })
    })
  })
})
