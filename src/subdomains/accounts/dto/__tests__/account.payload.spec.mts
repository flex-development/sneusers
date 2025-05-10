/**
 * @file Unit Tests - AccountPayload
 * @module sneusers/accounts/dto/tests/unit/AccountPayload
 */

import TestSubject from '#accounts/dto/account.payload'
import Account from '#accounts/entities/account.entity'
import AccountFactory from '#tests/utils/account.factory'

describe('unit:accounts/dto/AccountPayload', () => {
  let factory: AccountFactory

  beforeAll(() => {
    factory = new AccountFactory()
  })

  describe('constructor', () => {
    let account: Account
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(account = new Account(factory.makeOne()))
    })

    it('should set #email', () => {
      expect(subject).to.have.property('email', account.email)
    })

    it('should set #type', () => {
      expect(subject).to.have.property('type', account.role)
    })

    it('should set #uid', () => {
      expect(subject).to.have.property('uid', account.uid)
    })
  })
})
