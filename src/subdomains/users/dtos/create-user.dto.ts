import type { NumberString } from '@flex-development/tutils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Is } from '@sneusers/decorators'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

/**
 * @file Users Subdomain DTOs - CreateUserDTO
 * @module sneusers/subdomains/users/dtos/CreateUserDTO
 */

/**
 * Data used to create a new user.
 */
class CreateUserDTO {
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
}

export default CreateUserDTO
