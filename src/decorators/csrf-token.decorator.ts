import { NIL, OrNil } from '@flex-development/tutils'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { CsrfTokenFn } from '@sneusers/types'
import { Request } from 'express'

/**
 * @file Decorators - CsrfToken
 * @module sneusers/decorators/CsrfToken
 */

/**
 * Retrieves the `csrfToken` function from a request.
 *
 * If `action` is defined, a token value will be returned instead.
 *
 * @see {@link Request.csrfToken}
 * @see https://github.com/expressjs/csurf
 *
 * @param {OrNil<'create'>} [action] - Return function or token value
 * @param {ExecutionContext} context - Details about current request pipeline
 * @return {CsrfTokenFn | string} `csrfToken` function or function return value
 */
const CsrfToken = (
  action: OrNil<'create'>,
  context: ExecutionContext
): typeof action extends infer A
  ? A extends NIL | never
    ? CsrfTokenFn
    : string
  : CsrfTokenFn => {
  const csrfToken = context.switchToHttp().getRequest<Request>().csrfToken
  return action ? csrfToken() : csrfToken
}

export default createParamDecorator<
  OrNil<'create'>,
  ExecutionContext,
  CsrfTokenFn | string
>(CsrfToken)
