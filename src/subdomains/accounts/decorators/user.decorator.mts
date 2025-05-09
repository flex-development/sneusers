/**
 * @file Decorators - User
 * @module sneusers/accounts/decorators/User
 */

import type {
  Account,
  AccountDocument
} from '@flex-development/sneusers/accounts'
import {
  createParamDecorator,
  type ExecutionContext
} from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

/**
 * Get the account of the currently authenticated user.
 *
 * @decorator
 *
 * @const {() => ParameterDecorator} User
 */
const User: () => ParameterDecorator = createParamDecorator(user)

export default User

/**
 * Get the account of the currently authenticated user from a request.
 *
 * @this {void}
 *
 * @param {keyof AccountDocument | null | undefined} field
 *  The name of the field to pluck
 * @param {ExecutionContext} context
 *  Details about the current request pipeline
 * @return {Account | null}
 *  The account of the authenticated user
 */
function user(
  this: void,
  field: keyof AccountDocument | null | undefined,
  context: ExecutionContext
): Account | null {
  return context.switchToHttp().getRequest<FastifyRequest>().user ?? null
}
