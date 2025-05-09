/**
 * @file Unit Tests - WhoamiPayload
 * @module sneusers/accounts/dto/tests/unit/WhoamiPayload
 */

import TestSubject from '#accounts/dto/whoami.payload'
import Account from '#accounts/entities/account.entity'
import AccountFactory from '#tests/utils/account.factory'

describe('unit:accounts/dto/WhoamiPayload', () => {
  let factory: AccountFactory

  beforeAll(() => {
    factory = new AccountFactory()
  })

  describe('constructor()', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it('should set #uid', () => {
      expect(subject).to.have.property('uid', null)
    })
  })

  describe('constructor(account)', () => {
    let account: Account
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(account = new Account(factory.makeOne()))
    })

    it('should set #uid', () => {
      expect(subject).to.have.property('uid', account.uid)
    })
  })
})
