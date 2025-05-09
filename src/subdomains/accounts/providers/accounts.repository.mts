/**
 * @file Providers - AccountsRepository
 * @module sneusers/accounts/providers/AccountsRepository
 */

import Account from '#accounts/entities/account.entity'
import {
  InjectMapper,
  Mapper,
  Repository
} from '@flex-development/sneusers/database'
import { Injectable } from '@nestjs/common'

/**
 * User accounts repository.
 *
 * @class
 * @extends {Repository<Account>}
 */
@Injectable()
class AccountsRepository extends Repository<Account> {
  /**
   * Create a new user accounts repository.
   *
   * @param {Mapper<Account>} mapper
   *  User account data mapper
   */
  constructor(@InjectMapper(Account) mapper: Mapper<Account>) {
    super(mapper)
  }

  /**
   * Find a user account by email address.
   *
   * @public
   * @instance
   * @async
   *
   * @param {string} email
   *  The email address to search by
   * @return {Account | null}
   *  User account entity or `null`
   */
  public async findByEmail(email: string): Promise<Account | null> {
    return new Promise(resolve => {
      /**
       * The user account associated with {@linkcode email}.
       *
       * @var {Account | null} account
       */
      let account: Account | null = null

      for (const x of this.entities) {
        if (email === x.email) {
          account = x
          break
        }
      }

      return void resolve(account)
    })
  }
}

export default AccountsRepository
