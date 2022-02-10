/**
 * @file Auth Subdomain Interfaces - ILoginDTO
 * @module sneusers/subdomains/auth/interfaces/ILoginDTO
 */

/**
 * Successful login response body.
 */
interface ILoginDTO {
  readonly access_token: string
}

export default ILoginDTO
