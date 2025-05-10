/**
 * @file Events - AccountDeletedEvent
 * @module sneusers/accounts/events/AccountDeleted
 */

import type { Account } from '@flex-development/sneusers/accounts'

/**
 * User account deletion event.
 *
 * @class
 */
class AccountDeletedEvent {
  /**
   * Create a new user account deletion event.
   *
   * @param {Account} account
   *  The deleted account
   */
  constructor(public account: Account) {}
}

export default AccountDeletedEvent
