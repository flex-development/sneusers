import { ApiProperty } from '@nestjs/swagger'
import type { User } from '@sneusers/subdomains/users/entities'

/**
 * @file Auth Subdomain DTOs - LoginPayload
 * @module sneusers/subdomains/auth/dtos/LoginPayload
 */

/**
 * Data used to create a user access token.
 */
export default class LoginPayload {
  @ApiProperty({ description: "User's email address", type: String })
  readonly email: User['email']

  @ApiProperty({ description: "User's first name", type: String })
  readonly first_name: User['first_name']

  @ApiProperty({ description: 'User id', type: Number })
  readonly id: User['id']

  @ApiProperty({ description: "User's last name", type: String })
  readonly last_name: User['last_name']
}
