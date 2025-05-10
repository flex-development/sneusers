/**
 * @file Guards - JwtGuard
 * @module sneusers/accounts/guards/Jwt
 */

import AuthStrategy from '#enums/auth-strategy'
import type { Account } from '@flex-development/sneusers/accounts'
import {
  InvalidCredentialException
} from '@flex-development/sneusers/accounts/errors'
import { Injectable } from '@nestjs/common'
import { AuthGuard, type IAuthGuard } from '@nestjs/passport'

/**
 * JWT authentication guard.
 *
 * @class
 * @implements {IAuthGuard}
 */
@Injectable()
class JwtGuard extends AuthGuard(AuthStrategy.JWT) implements IAuthGuard {
  /**
   * Handle an authentication request.
   *
   * @public
   * @instance
   * @override
   *
   * @template {any} [T=Account]
   *  User data
   *
   * @param {Error | null} error
   *  Error thrown by authentication strategy
   * @param {T | false | null | undefined} account
   *  The account of the authenticated user if authentication is successful
   * @return {T}
   *  The account of the authenticated user
   * @throws {Error | InvalidCredentialException}
   *  If authentication failed
   */
  public override handleRequest<T = Account>(
    error: Error | null,
    account: T | false | null | undefined
  ): T {
    if (error || !account) throw error ?? new InvalidCredentialException()
    return account
  }
}

export default JwtGuard
