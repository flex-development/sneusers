/**
 * @file Functional Tests - Account
 * @module sneusers/accounts/entities/tests/functional/Account
 */

import TestSubject from '#accounts/entities/account.entity'
import AccountCreatedEvent from '#accounts/events/account-created.event'
import AccountFactory from '#tests/utils/account.factory'
import { omit } from '@flex-development/tutils'
import type { MockInstance } from 'vitest'

describe('functional:accounts/entities/Account', () => {
  let factory: AccountFactory

  beforeAll(() => {
    factory = new AccountFactory()
  })

  describe('constructor', () => {
    let apply: MockInstance<TestSubject['apply']>

    beforeEach(() => {
      apply = vi.spyOn(TestSubject.prototype, 'apply')
    })

    it('should apply account created event if account is new', () => {
      // Act
      new TestSubject(omit(factory.makeOne(), ['_id']))

      // Expect
      expect(apply).toHaveBeenCalledOnce()
      expect(apply.mock.lastCall![0]).to.be.instanceof(AccountCreatedEvent)
    })

    it('should not apply account created event if account exists', () => {
      // Act
      new TestSubject(factory.makeOne())

      // Expect
      expect(apply).not.toHaveBeenCalled()
    })
  })
})
