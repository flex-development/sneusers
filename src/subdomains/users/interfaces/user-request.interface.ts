import type { ObjectPlain, OneOrMany } from '@flex-development/tutils'
import type { QueryParams } from '@sneusers/models'
import type { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import type { Request } from 'express'

/**
 * @file Users Subdomain Interfaces - UserRequest
 * @module sneusers/subdomains/users/interfaces/UserRequest
 */

/**
 * HTTP request with a {@link User} entity object attached.
 *
 * @template ResBody - Response body
 * @template ReqQuery - Query parameters
 * @template ReqBody - Request body
 * @template Params - Request parameters
 *
 * @extends Request
 */
interface UserRequest<
  ResBody extends OneOrMany<UserDTO> = OneOrMany<UserDTO>,
  ReqQuery extends QueryParams<User> = QueryParams<User>,
  ReqBody = any,
  Params extends ObjectPlain = ObjectPlain
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user: User
}

export default UserRequest
