import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - RequestGoogleAuthDTO
 * @module sneusers/subdomains/auth/dtos/RequestGoogleAuthDTO
 */

/**
 * Query parameters required to authorize a user using Google OAuth.
 */
class RequestGoogleAuthDTO {
  @ApiPropertyOptional({ description: 'Account email or id', type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly authuser?: string

  @ApiProperty({ description: 'Temporary authorization code', type: String })
  @IsString()
  @Type(() => String)
  readonly code: string

  @ApiPropertyOptional({ description: 'Hosted domain', type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly hd?: string

  @ApiPropertyOptional({ description: 'User prompt list', type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly prompt?: string

  @ApiProperty({ description: 'Requested oauth scopes', type: String })
  @IsString()
  @Type(() => String)
  readonly scope: string

  @ApiProperty({ description: 'CSRF protection string', type: String })
  @IsString()
  @Type(() => String)
  readonly state: string
}

export default RequestGoogleAuthDTO
