import { ApiProperty } from '@nestjs/swagger'
import AccessTokenPayload from './access-token-payload.dto'

/**
 * @file Auth Subdomain DTOs - LoginDTO
 * @module sneusers/subdomains/auth/dtos/LoginDTO
 */

/**
 * Successful login response body.
 */
export default class LoginDTO {
  @ApiProperty({ description: 'User access token', type: String })
  readonly access_token: string

  @ApiProperty({ description: 'User id', type: Number })
  readonly id: AccessTokenPayload['sub']
}
