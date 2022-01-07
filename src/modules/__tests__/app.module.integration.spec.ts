import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from '@sneusers/models'
import createApp from '@tests/utils/create-app.util'
import type { Testcase } from '@tests/utils/types'
import TestSubject from '../app.module'

/**
 * @file Integration Tests - AppModule
 * @module sneusers/modules/tests/integration/AppModule
 */

describe('integration:modules/AppModule', () => {
  let app: INestApplication

  before(async () => {
    const napp = await createApp({ imports: [TestSubject] })
    app = await napp.app.init()
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
        { expected: 'boolean', variable: 'DB_AUTO_LOAD_MODELS' },
        { expected: 'string', variable: 'DB_HOST' },
        { expected: 'string', variable: 'DB_NAME' },
        { expected: 'string', variable: 'DB_PASSWORD' },
        { expected: 'number', variable: 'DB_PORT' },
        { expected: 'string', variable: 'DB_TIMEZONE' },
        { expected: 'string', variable: 'DB_USERNAME' },
        { expected: 'boolean', variable: 'DEV' },
        { expected: 'string', variable: 'HOST' },
        { expected: 'string', variable: 'HOSTNAME' },
        { expected: 'string', type: 'NodeEnv', variable: 'NODE_ENV' },
        { expected: 'number', variable: 'PORT' },
        { expected: 'boolean', variable: 'PROD' },
        { expected: 'boolean', variable: 'TEST' }
      ]

      cases.forEach(({ expected, type = expected, variable }) => {
        it(`should return a ${type} given ['${variable}']`, () => {
          expect(config.get(variable)).to.be.a(expected)
        })
      })
    })
  })
})
