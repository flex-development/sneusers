import { OrUndefined, PathValue } from '@flex-development/tutils'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { User } from '@sneusers/subdomains/users/entities'
import type { IUser, UserRequest } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Users Subdomain Decorators - AuthedUser
 * @module sneusers/subdomains/users/decorators/AuthedUser
 */

/**
 * Returns the authenticated {@link User} from {@link UserRequest}.
 *
 * @param {keyof IUser} [attribute] - Name of {@link User} property to retrieve
 * @param {ExecutionContext} ctx - Object containing methods for accessing
 * the route handler and the class about to be invoked
 * @return {User | PathValue<IUser>} `User` object or property value
 */
const AuthedUser = (
  attribute: OrUndefined<keyof IUser>,
  ctx: ExecutionContext
): User | PathValue<IUser> => {
  const req: UserRequest = ctx.switchToHttp().getRequest<UserRequest>()

  return attribute ? req.user[attribute] : req.user
}

export default createParamDecorator<
  keyof IUser,
  ExecutionContext,
  User | PathValue<IUser>
>(AuthedUser)
