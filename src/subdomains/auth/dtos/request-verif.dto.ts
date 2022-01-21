import type { NullishString } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'
import { VerifType } from '@sneusers/subdomains/auth/enums'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - RequestVerifDTO
 * @module sneusers/subdomains/auth/models/RequestVerifDTO
 */

/**
 * Data used to verify a user.
 */
class RequestVerifDTO {
  @ApiProperty({ description: 'User verification token', type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  token: NullishString

  @ApiProperty({
    description: 'Verification type',
    enum: VerifType,
    enumName: 'VerifType'
  })
  @IsEnum(VerifType)
  @IsOptional()
  @Type(() => String)
  type: VerifType
}

export default RequestVerifDTO
