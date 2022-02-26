import type { NumberString } from '@flex-development/tutils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Is } from '@sneusers/decorators'
import { OAuthProvider } from '@sneusers/subdomains/auth/enums'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import type { IUserRaw } from '../interfaces'

/**
 * @file Users Subdomain DTOs - CreateUserDTO
 * @module sneusers/subdomains/users/dtos/CreateUserDTO
 */

/**
 * Data used to create a new user.
 */
class CreateUserDTO {
  /** When user was created. */
  readonly created_at?: never

  @ApiPropertyOptional({
    default: null,
    description: 'Display name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly display_name?: IUserRaw['display_name']

  @ApiProperty({
    description: 'Email address',
    format: 'email',
    maxLength: 254,
    minLength: 3,
    type: String
  })
  @IsEmail()
  @MinLength(3)
  @MaxLength(254)
  readonly email: IUserRaw['email']

  /** Email verified? */
  readonly email_verified?: never

  @ApiPropertyOptional({
    default: null,
    description: 'First name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly first_name?: IUserRaw['first_name']

  @ApiPropertyOptional({
    description: 'Unique id',
    oneOf: [{ type: 'number' }, { type: 'string' }]
  })
  @Is({ types: ['number', 'string'] })
  @IsOptional()
  readonly id?: NumberString

  @ApiPropertyOptional({
    default: null,
    description: 'Last name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly last_name?: IUserRaw['last_name']

  @ApiPropertyOptional({
    default: null,
    description: 'Secure password',
    minLength: 8,
    nullable: true,
    type: String
  })
  @IsString()
  @IsOptional()
  readonly password?: IUserRaw['password']

  @ApiPropertyOptional({
    default: null,
    description: 'Authentication provider',
    enum: OAuthProvider,
    enumName: 'OAuthProvider',
    nullable: true
  })
  @IsEnum(OAuthProvider)
  @IsOptional()
  readonly provider?: IUserRaw['provider']

  /** When user was last modified. */
  readonly updated_at?: never
}

export default CreateUserDTO
