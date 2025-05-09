/**
 * @file Unit Tests - JwtOptionsFactory
 * @module sneusers/accounts/factories/tests/unit/JwtOptionsFactory
 */

import TestSubject from '#accounts/factories/jwt-options.factory'
import ConfigModule from '#modules/config.module'
import type { Config } from '@flex-development/sneusers/types'
import { isObjectPlain } from '@flex-development/tutils'
import { ConfigService } from '@nestjs/config'
import { type JwtModuleOptions } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'

describe('unit:accounts/factories/JwtOptionsFactory', () => {
  let config: ConfigService<Config, true>
  let ref: TestingModule
  let subject: TestSubject

  beforeAll(async () => {
    ref = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [TestSubject]
    }).compile()

    config = ref.get(ConfigService)
    subject = ref.get(TestSubject)
  })

  describe('#createJwtOptions', () => {
    let keys: string[]
    let result: JwtModuleOptions
    let signOptionKeys: string[]
    let url: URL

    beforeAll(() => {
      keys = ['secret', 'signOptions']
      signOptionKeys = ['audience', 'issuer']
      url = config.get('URL')
    })

    beforeEach(() => {
      result = subject.createJwtOptions()
    })

    it('should return jwt module options', () => {
      expect(result).to.have.keys(keys)
      expect(result).to.have.property('secret', config.get('JWT_SECRET'))
      expect(result.signOptions).to.satisfy(isObjectPlain)
      expect(result.signOptions).to.have.keys(signOptionKeys)
      expect(result.signOptions).to.have.property('audience', url.host)
      expect(result.signOptions).to.have.property('issuer', url.host)
    })
  })
})
