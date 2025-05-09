/**
 * @file Test Utilities - AccountFactory
 * @module tests/utils/AccountFactory
 */

import Role from '#accounts/enums/role'
import ACCOUNT_PASSWORD from '#fixtures/account-password'
import SeedFactory from '#tests/utils/seed.factory'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import bcrypt from 'bcrypt'
import { ObjectId } from 'bson'
import random from 'random-item'

/**
 * Account document factory.
 *
 * @class
 * @extends {SeedFactory<AccountDocument>}
 */
class AccountFactory extends SeedFactory<AccountDocument> {
  /**
   * Get a random user account role.
   *
   * @public
   * @static
   *
   * @return {Role}
   *  Random user account role
   */
  public static get role(): Role {
    return random(Object.values(Role))
  }

  /**
   * Create a random account collection document.
   *
   * @public
   * @instance
   *
   * @return {AccountDocument}
   *  Account collection document
   */
  public makeOne(): AccountDocument {
    return {
      _id: new ObjectId(),
      created_at: Date.now(),
      email: this.faker.internet.email({ provider: 'test.sneusers.app' }),
      password: bcrypt.hashSync(ACCOUNT_PASSWORD, 10),
      role: AccountFactory.role,
      updated_at: null
    }
  }
}

export default AccountFactory
