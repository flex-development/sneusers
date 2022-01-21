import { ApiProperty } from '@nestjs/swagger'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { Type } from 'class-transformer'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - RequestLoginDTO
 * @module sneusers/subdomains/auth/dtos/RequestLoginDTO
 */

/**
 * Data used to login an existing user.
 */
class RequestLoginDTO {
  @ApiProperty({
    description: 'Email address',
    maxLength: 254,
    minLength: 3,
    type: String
  })
  @IsEmail()
  @MinLength(3)
  @MaxLength(254)
  @Type(() => String)
  readonly email: IUserRaw['email']

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    nullable: true,
    type: String
  })
  @IsString()
  @Type(() => String)
  readonly password: IUserRaw['password']
}

export default RequestLoginDTO
