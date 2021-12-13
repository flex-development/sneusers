import type { PathValue } from '@flex-development/tutils'
import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import configuration from '@sneusers/config/configuration'
import { EnvironmentVariables as EnvVars } from '@sneusers/models'
import createApp from '@tests/utils/create-app.util'
import type { Testcase } from '@tests/utils/types'
import TestSubject from '../app.module'

/**
 * @file Unit Tests - AppModule
 * @module sneusers/modules/tests/unit/AppModule
 */

describe('unit:modules/AppModule', () => {
  let app: INestApplication

  before(async () => {
    const napp = await createApp({ imports: [TestSubject] })
    app = await napp.app.init()
  })

  after(async () => {
    await app.close()
  })

  describe('configuration', () => {
    type Case = Testcase<PathValue<EnvVars>> & { variable: keyof EnvVars }

    const CONF: EnvVars = configuration(NodeEnv.TEST)
    let config: ConfigService<EnvVars, true>

    before(() => {
      config = app.get<typeof config>(ConfigService)
    })

    const cases: Case[] = [
      { expected: CONF.DESCRIPTION, variable: 'DESCRIPTION' },
      { expected: CONF.DEV, variable: 'DEV' },
      { expected: CONF.HOST, variable: 'HOST' },
      { expected: CONF.HOSTNAME, variable: 'HOSTNAME' },
      { expected: CONF.NODE_ENV, variable: 'NODE_ENV' },
      { expected: CONF.PORT, variable: 'PORT' },
      { expected: CONF.PROD, variable: 'PROD' },
      { expected: CONF.PROTOCOL, variable: 'PROTOCOL' },
      { expected: CONF.TEST, variable: 'TEST' },
      { expected: CONF.TITLE, variable: 'TITLE' },
      { expected: CONF.VERSION, variable: 'VERSION' }
    ]

    cases.forEach(({ expected, variable }) => {
      it(`should set ${variable}`, () => {
        // Arrange
        const infer = true

        // Act
        const result = config.get(variable, { infer })

        // Assert
        assert.equal(result, expected)
      })
    })
  })
})
