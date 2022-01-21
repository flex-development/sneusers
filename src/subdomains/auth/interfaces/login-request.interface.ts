import type { RequestLoginDTO } from '@sneusers/subdomains/auth/dtos'
import type { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import type { UserRequest } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain Interfaces - LoginRequest
 * @module sneusers/subdomains/auth/interfaces/LoginRequest
 */

/**
 * HTTP login request.
 *
 * Successful logins will attach a `user` property to the request.
 *
 * @extends {UserRequest<UserDTO, never, RequestLoginDTO>}
 */
interface LoginRequest extends UserRequest<UserDTO, never, RequestLoginDTO> {
  /**
   * The authenticated user.
   *
   * @see {@link User}
   */
  user: User | never
}

export default LoginRequest
