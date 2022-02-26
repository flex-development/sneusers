import type { ExceptionCode } from '@flex-development/exceptions/enums'
import type {
  ObjectPlain,
  OneOrMany,
  OrNull,
  OrPromise,
  OrUndefined
} from '@flex-development/tutils'
import type { ExecutionContext } from '@nestjs/common'
import type { IAuthGuard as INestAuthGuard } from '@nestjs/passport'
import type { Exception } from '@sneusers/exceptions'
import type { User } from '@sneusers/subdomains/users/entities'
import type { Request, Response } from 'express'
import type { AuthenticateOptions } from '../namespaces'

/**
 * @file Auth Subdomain Interfaces - IAuthGuard
 * @module sneusers/subdomains/auth/interfaces/IAuthGuard
 */

/**
 * {@link createAuthGuard} return type interface.
 *
 * @extends INestAuthGuard
 */
interface IAuthGuard<TUser extends User = User> extends INestAuthGuard {
  options: AuthenticateOptions.Base

  getAuthenticateOptions(
    context: ExecutionContext
  ): OrPromise<AuthenticateOptions.Base>
  getRequest<T extends Request = Request>(context: ExecutionContext): T
  getResponse<T extends Response = Response>(context: ExecutionContext): T
  handleRequest<T extends TUser = TUser>(
    err: OrNull<Error | Exception>,
    user: OrUndefined<T | false>,
    info: OrUndefined<OneOrMany<ObjectPlain>>,
    context: ExecutionContext,
    status: OrUndefined<OneOrMany<ExceptionCode>>
  ): T
}

export default IAuthGuard
