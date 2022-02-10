import { OrNil, OrNull, PathValue } from '@flex-development/tutils'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@sneusers/subdomains/users/entities'
import type { UserRequest } from '@sneusers/subdomains/users/interfaces'
import { IUser } from '@sneusers/subdomains/users/interfaces'
import type { Request } from 'express'

/**
 * @file Users Subdomain Decorators - CurrentUser
 * @module sneusers/subdomains/users/decorators/CurrentUser
 */

/**
 * Gets the current {@link User} from a request.
 *
 * Pick a specific field by supplying `attribute`.
 *
 * @param {OrNil<keyof IUser>} [attribute] - Name of field value to retrieve
 * @param {ExecutionContext} context - Details about current request pipeline
 * @return {OrNull<User | PathValue<IUser>>} `User`, field value, or `null`
 */
const CurrentUser = (
  attribute: OrNil<keyof IUser>,
  context: ExecutionContext
): OrNull<User | PathValue<IUser>> => {
  const user = context.switchToHttp().getRequest<Request | UserRequest>().user
  return user ? (attribute ? user[attribute] : user) : null
}

export default createParamDecorator<
  OrNil<keyof IUser>,
  ExecutionContext,
  OrNull<User | PathValue<IUser>>
>(CurrentUser)
