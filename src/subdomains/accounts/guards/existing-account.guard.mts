/**
 * @file Guards - ExistingAccountGuard
 * @module sneusers/accounts/guards/ExistingAccount
 */

import AccountsRepository from '#accounts/providers/accounts.repository'
import {
  MissingAccountException
} from '@flex-development/sneusers/accounts/errors'
import {
  Injectable,
  type CanActivate,
  type ExecutionContext
} from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

/**
 * Existing account guard.
 *
 * @class
 * @implements {CanActivate}
 */
@Injectable()
class ExistingAccountGuard implements CanActivate {
  /**
   * Create a new existing account guard.
   *
   * @param {AccountsRepository} accounts
   *  User accounts repository
   */
  constructor(protected accounts: AccountsRepository) {}

  /**
   * Check `request.params.uid` references an existing account.
   *
   * Fails if an account is not found.
   *
   * @public
   * @instance
   * @async
   *
   * @param {ExecutionContext} context
   *  Object containing details about the current request pipeline
   * @return {Promise<true>}
   *  Whether the current request is allowed to proceed
   * @throws {MissingAccountException}
   *  If an account is not found
   */
  public async canActivate(context: ExecutionContext): Promise<true> {
    /**
     * The incoming request object.
     *
     * @const {FastifyRequest} req
     */
    const req: FastifyRequest = context.switchToHttp().getRequest()

    /**
     * Unique account id.
     *
     * @const {string} uid
     */
    const uid: string = String(req.params.uid)

    if (!await this.accounts.findById(uid)) {
      throw new MissingAccountException(uid)
    }

    return true
  }
}

export default ExistingAccountGuard
