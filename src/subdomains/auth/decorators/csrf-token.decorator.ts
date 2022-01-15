import { OrUndefined } from '@flex-development/tutils'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

/**
 * @file Auth Subdomain Decorators - CsrfToken
 * @module sneusers/subdomains/auth/decorators/CsrfToken
 */

export type CsrfTokenFn = Request['csrfToken']

type GetCsrfToken<A extends OrUndefined<'create'>> = A extends 'create'
  ? string
  : CsrfTokenFn

/**
 * Retrieves the [`csrfToken`][1] from a request.
 *
 * [1]: https://github.com/expressjs/csurf#csurfoptions
 *
 * @param {OrUndefined<'create'>} [action] - Return function or token value
 * @param {ExecutionContext} ctx - Object containing methods for accessing
 * the route handler and the class about to be invoked
 * @return {CsrfTokenFn | string} `csrfToken` function or function return value
 */
function CsrfToken(
  action: OrUndefined<'create'>,
  ctx: ExecutionContext
): GetCsrfToken<typeof action> {
  const csrfToken = ctx.switchToHttp().getRequest<Request>().csrfToken
  return action ? csrfToken() : csrfToken
}

export default createParamDecorator<
  OrUndefined<'create'>,
  ExecutionContext,
  CsrfTokenFn | string
>(CsrfToken)
