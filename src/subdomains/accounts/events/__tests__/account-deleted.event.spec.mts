/**
 * @file Unit Tests - AccountDeletedEvent
 * @module sneusers/accounts/events/tests/unit/AccountDeleted
 */

import Account from '#accounts/entities/account.entity'
import TestSubject from '#accounts/events/account-deleted.event'
import AccountFactory from '#tests/utils/account.factory'

describe('unit:accounts/events/AccountDeletedEvent', () => {
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

    it('should set #account', () => {
      expect(subject).to.have.property('account', account)
    })
  })
})
