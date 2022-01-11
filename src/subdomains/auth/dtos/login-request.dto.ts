import { ApiProperty } from '@nestjs/swagger'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - LoginRequestDTO
 * @module sneusers/subdomains/auth/dtos/LoginRequestDTO
 */

/**
 * Data used to login an existing user.
 */
export default class LoginRequestDTO {
  @ApiProperty({
    description: 'Email address',
    maxLength: 254,
    minLength: 3,
    type: String
  })
  @IsEmail()
  @MinLength(3)
  @MaxLength(254)
  readonly email: IUserRaw['email']

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    nullable: true,
    type: String
  })
  @IsString()
  readonly password: IUserRaw['password']
}
