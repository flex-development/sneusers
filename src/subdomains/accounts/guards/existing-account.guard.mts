/**
 * @file Guards - ExistingAccountGuard
 * @module sneusers/accounts/guards/ExistingAccount
 */

import GetAccountQuery from '#accounts/queries/get-account.query'
import {
  Injectable,
  type CanActivate,
  type ExecutionContext
} from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
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
   * @param {QueryBus} queries
   *  The query bus
   */
  constructor(protected queries: QueryBus) {}

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
   */
  public async canActivate(context: ExecutionContext): Promise<true> {
    /**
     * The incoming request object.
     *
     * @const {FastifyRequest} req
     */
    const req: FastifyRequest = context.switchToHttp().getRequest()

    // check for existing user account.
    // the query handler will throw if an account is not found.
    await this.queries.execute(new GetAccountQuery(String(req.params.uid)))

    return true
  }
}

export default ExistingAccountGuard
