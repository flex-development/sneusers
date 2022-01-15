import { IsBoolean, IsOptional } from 'class-validator'
import { IRefreshTokenRaw } from '../interfaces'

/**
 * @file Auth Subdomain DTOs - PatchRefreshTokenDTO
 * @module sneusers/subdomains/auth/dtos/PatchRefreshTokenDTO
 */

/**
 * Data used to update an existing `RefreshToken` instance.
 */
export default class PatchRefreshTokenDTO {
  /**
   * Mark token as enabled or revoked.
   */
  @IsBoolean()
  @IsOptional()
  revoked?: IRefreshTokenRaw['revoked']
}
