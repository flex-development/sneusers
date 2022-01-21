import { ApiProperty } from '@nestjs/swagger'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain DTOs - LoginDTO
 * @module sneusers/subdomains/auth/dtos/LoginDTO
 */

/**
 * Successful login response body.
 */
class LoginDTO {
  @ApiProperty({ description: 'User access token', type: String })
  readonly access_token: string

  @ApiProperty({ description: 'User id', type: Number })
  readonly id: IUserRaw['id']
}

export default LoginDTO
