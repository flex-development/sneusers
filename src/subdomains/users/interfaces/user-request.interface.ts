import type { ObjectPlain, OneOrMany } from '@flex-development/tutils'
import type { QueryParams } from '@sneusers/models'
import type { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import type { Request } from 'express'
import type IUser from './user.interface'

/**
 * @file Users Subdomain Interfaces - UserRequest
 * @module sneusers/subdomains/users/interfaces/UserRequest
 */

/**
 * HTTP request with a {@link User} entity object attached.
 *
 * @template Payload - Response type
 * @template Query - Query parameters
 * @template Body - Request body type
 * @template Params - Request parameters
 *
 * @extends {Request}
 */
interface UserRequest<
  Payload extends OneOrMany<UserDTO<boolean>> = OneOrMany<UserDTO>,
  Query extends QueryParams<IUser> = QueryParams<IUser>,
  Body = any,
  Params extends ObjectPlain = ObjectPlain
> extends Request<Params, Payload, Body, Query> {
  user: User
}

export default UserRequest
