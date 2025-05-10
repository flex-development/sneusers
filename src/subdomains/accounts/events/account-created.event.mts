/**
 * @file Events - AccountCreatedEvent
 * @module sneusers/accounts/events/AccountCreated
 */

import type { Account } from '@flex-development/sneusers/accounts'

/**
 * User account creation event.
 *
 * @class
 */
class AccountCreatedEvent {
  /**
   * Create a new user account creation event.
   *
   * @param {Account} account
   *  The new account
   */
  constructor(public account: Account) {}
}

export default AccountCreatedEvent
