import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import LoginPayload from './login-payload.dto'

/**
 * @file Auth Subdomain DTOs - LoginDTO
 * @module sneusers/subdomains/auth/dtos/LoginDTO
 */

/**
 * Payload from a successful login.
 *
 * @extends {LoginPayload}
 */
export default class LoginDTO extends LoginPayload {
  @ApiProperty({ description: 'User access token', type: String })
  @IsString()
  readonly access_token: string
}
