/**
 * @file Events - AccountCreatedEvent
 * @module sneusers/accounts/events/AccountCreated
 */

import type { Account } from '@flex-development/sneusers/accounts'

/**
 * User account created event.
 *
 * @class
 */
class AccountCreatedEvent {
  /**
   * Create a new user account created event.
   *
   * @param {Account} account
   *  The new account
   */
  constructor(public account: Account) {}
}

export default AccountCreatedEvent
