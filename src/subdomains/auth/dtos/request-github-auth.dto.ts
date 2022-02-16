import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - RequestGitHubAuthDTO
 * @module sneusers/subdomains/auth/dtos/RequestGitHubAuthDTO
 */

/**
 * Query parameters required to authorize a user using GitHub OAuth.
 *
 * @see https://docs.github.com/developers/apps/building-oauth-apps/authorizing-oauth-apps
 */
class RequestGitHubAuthDTO {
  @ApiProperty({ description: 'Temporary authorization code', type: String })
  @IsString()
  @Type(() => String)
  readonly code: string

  @ApiProperty({ description: 'CSRF protection string', type: String })
  @IsString()
  @Type(() => String)
  readonly state: string
}

export default RequestGitHubAuthDTO
