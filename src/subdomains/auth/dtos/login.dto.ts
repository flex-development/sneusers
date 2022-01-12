import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import JwtPayload from './jwt-payload.dto'

/**
 * @file Auth Subdomain DTOs - LoginDTO
 * @module sneusers/subdomains/auth/dtos/LoginDTO
 */

/**
 * Successful login response body.
 *
 * @extends {JwtPayload}
 */
export default class LoginDTO extends JwtPayload {
  @ApiProperty({ description: 'User access token', type: String })
  @IsString()
  readonly access_token: string
}
