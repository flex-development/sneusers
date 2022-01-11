import type { LoginRequestDTO } from '@sneusers/subdomains/auth/dtos'
import type { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { UserRequest } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Users Subdomain Interfaces - LoginRequest
 * @module sneusers/subdomains/users/interfaces/LoginRequest
 */

/**
 * HTTP login request.
 *
 * Successful logins will attach a `user` property to the request.
 *
 * @extends {UserRequest<UserDTO<true>, never, LoginRequestDTO>}
 */
interface LoginRequest
  extends UserRequest<UserDTO<true>, never, LoginRequestDTO> {
  user: UserRequest<UserDTO<true>, never, LoginRequestDTO>['user'] | never
}

export default LoginRequest
