/**
 * @file Unit Tests - AccountCreatedPayload
 * @module sneusers/accounts/dto/tests/unit/AccountCreatedPayload
 */

import TestSubject from '#accounts/dto/account-created.payload'
import Account from '#accounts/entities/account.entity'
import AccountFactory from '#tests/utils/account.factory'

describe('unit:accounts/dto/AccountCreatedPayload', () => {
  let factory: AccountFactory

  beforeAll(() => {
    factory = new AccountFactory()
  })

  describe('constructor', () => {
    let access_token: string
    let account: Account
    let refresh_token: string
    let subject: TestSubject

    beforeAll(() => {
      account = new Account(factory.makeOne())

      access_token = faker.internet.jwt()
      refresh_token = faker.internet.jwt()

      subject = new TestSubject(account, access_token, refresh_token)
    })

    it('should set #access_token', () => {
      expect(subject).to.have.property('access_token', access_token)
    })

    it('should set #refresh_token', () => {
      expect(subject).to.have.property('refresh_token', refresh_token)
    })

    it('should set #uid', () => {
      expect(subject).to.have.property('uid', account.uid)
    })
  })
})
