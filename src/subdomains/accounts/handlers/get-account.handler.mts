/**
 * @file Handlers - GetAccountHandler
 * @module sneusers/accounts/handlers/GetAccount
 */

import Account from '#accounts/entities/account.entity'
import MissingAccountException from '#accounts/errors/missing-account.exception'
import AccountsRepository from '#accounts/providers/accounts.repository'
import GetAccountQuery from '#accounts/queries/get-account.query'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'

/**
 * Account query handler.
 *
 * @class
 * @implements {IQueryHandler<GetAccountQuery>}
 */
@QueryHandler(GetAccountQuery)
class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  /**
   * Create a new account query handler.
   *
   * @param {AccountsRepository} accounts
   *  User accounts repository
   */
  constructor(protected accounts: AccountsRepository) {}

  /**
   * Get a user account by id.
   *
   * Fails if an account is not found.
   *
   * @public
   * @instance
   * @async
   *
   * @param {GetAccountQuery} query
   *  The query to execute
   * @return {Promise<Account>}
   *  The user account referenced by {@linkcode query.uid}
   * @throws {MissingAccountException}
   *  If an account is not found
   */
  public async execute(query: GetAccountQuery): Promise<Account> {
    /**
     * The user account referenced by {@linkcode query.uid}.
     *
     * @const {Account | null} account
     */
    const account: Account | null = await this.accounts.findById(query.uid)

    // throw on missing account.
    if (!account) throw new MissingAccountException(query.uid)

    return account
  }
}

export default GetAccountHandler
