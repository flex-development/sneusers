import type { NullishString } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { VerifType } from '../enums'

/**
 * @file Auth Subdomain DTOs - RequestVerifDTO
 * @module sneusers/subdomains/auth/dtos/RequestVerifDTO
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
