/**
 * @file Unit Tests - Account
 * @module sneusers/accounts/entities/tests/unit/Account
 */

import TestSubject from '#accounts/entities/account.entity'
import AccountFactory from '#tests/utils/account.factory'
import type { AccountDocument } from '@flex-development/sneusers/accounts'

describe('unit:accounts/entities/Account', () => {
  let factory: AccountFactory

  beforeAll(() => {
    factory = new AccountFactory()
  })

  describe('constructor', () => {
    let props: AccountDocument
    let subject: TestSubject

    beforeAll(() => {
      props = factory.makeOne()
      subject = new TestSubject(props)
    })

    it('should not automatically commit events', () => {
      expect(subject).to.have.property('autoCommit', false)
    })

    it('should set #email', () => {
      expect(subject).to.have.property('email', props.email)
    })

    it('should set #password', () => {
      expect(subject).to.have.property('password', props.password)
    })

    it('should set #role', () => {
      expect(subject).to.have.property('role', props.role)
    })
  })
})
