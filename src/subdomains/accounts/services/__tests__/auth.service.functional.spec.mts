/**
 * @file Functional Tests - AuthService
 * @module sneusers/accounts/services/tests/functional/AuthService
 */

import Account from '#accounts/entities/account.entity'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import TestSubject from '#accounts/services/auth.service'
import date from '#fixtures/date'
import ConfigModule from '#modules/config.module'
import AccountFactory from '#tests/utils/account.factory'
import type { Config, JsonObject } from '@flex-development/sneusers/types'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService, type JwtSignOptions } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'
import type { MockInstance } from 'vitest'

describe('functional:accounts/services/AuthService', () => {
  let account: Account
  let config: ConfigService<Config, true>
  let jwt: JwtService
  let payload: JsonObject
  let ref: TestingModule
  let subject: TestSubject

  beforeAll(async () => {
    vi.setSystemTime(date)

    ref = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.registerAsync({ useClass: JwtOptionsFactory })
      ],
      providers: [TestSubject]
    }).compile()

    account = new Account(new AccountFactory().makeOne())
    config = ref.get(ConfigService)
    jwt = ref.get(JwtService)
    subject = ref.get(TestSubject)

    payload = { email: account.email, iat: Date.now(), role: account.role }
  })

  describe('#accessToken', () => {
    let options: JwtSignOptions
    let signAsync: MockInstance<JwtService['signAsync']>

    beforeAll(() => {
      options = { expiresIn: config.get('JWT_EXPIRY'), subject: account.uid }
    })

    beforeEach(() => {
      signAsync = vi.spyOn(jwt, 'signAsync')
    })

    it('should create access token for `account`', async () => {
      // Act
      await subject.accessToken(account)

      // Expect
      expect(signAsync).toHaveBeenCalledOnce()
      expect(signAsync.mock.lastCall).to.be.an('array').of.length(2)
      expect(signAsync.mock.lastCall![0]).to.eql(payload)
      expect(signAsync.mock.lastCall![1]).to.eql(options)
    })
  })

  describe('#refreshToken', () => {
    let options: JwtSignOptions
    let signAsync: MockInstance<JwtService['signAsync']>

    beforeAll(() => {
      options = {
        expiresIn: config.get('JWT_EXPIRY_REFRESH'),
        subject: account.uid
      }
    })

    beforeEach(() => {
      signAsync = vi.spyOn(jwt, 'signAsync')
    })

    it('should create refresh token for `account`', async () => {
      // Act
      await subject.refreshToken(account)

      // Expect
      expect(signAsync).toHaveBeenCalledOnce()
      expect(signAsync.mock.lastCall).to.be.an('array').of.length(2)
      expect(signAsync.mock.lastCall![0]).to.eql(payload)
      expect(signAsync.mock.lastCall![1]).to.eql(options)
    })
  })
})
