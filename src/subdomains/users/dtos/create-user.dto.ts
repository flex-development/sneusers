import { NullishString, ObjectPlain } from '@flex-development/tutils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Is } from '@sneusers/decorators'
import { OAuthProvider } from '@sneusers/subdomains/auth/enums'
import { Numeric } from '@sneusers/types'
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
  readonly id?: Numeric | number

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

  /**
   * Creates a new dto instance.
   *
   * @param {ObjectPlain} [values={}] - DTO values
   * @param {NullishString} [values.display_name=null] - Display name
   * @param {string} [values.email] - Unique email address
   * @param {NullishString} [values.first_name=null] - First name
   * @param {Numeric | number} [values.id] - Unique identifier
   * @param {NullishString} [values.last_name=null] - Last name
   * @param {NullishString} [values.password=null] - Password
   * @param {NullishString} [values.provider=null] - Authentication provider
   */
  constructor({
    display_name = null,
    email,
    first_name = null,
    id,
    last_name = null,
    password = null,
    provider = null
  }: ObjectPlain = {}) {
    this.display_name = display_name
    this.email = email
    this.first_name = first_name
    this.id = id
    this.last_name = last_name
    this.password = password
    this.provider = provider
  }
}

export default CreateUserDTO
