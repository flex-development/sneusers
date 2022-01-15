import type { IRefreshTokenRaw } from '@sneusers/subdomains/auth/interfaces'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { IsNumber, IsOptional } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - CreateRefreshTokenDTO
 * @module sneusers/subdomains/auth/dtos/CreateRefreshTokenDTO
 */

/**
 * Data used to create a new `RefreshToken` instance.
 */
export default class CreateRefreshTokenDTO {
  /**
   * Time to live (in seconds).
   *
   * @default 86400
   */
  @IsNumber()
  @IsOptional()
  ttl?: IRefreshTokenRaw['expires']

  /**
   * Refresh token owner.
   */
  @IsNumber()
  user: IUserRaw['id']
}
