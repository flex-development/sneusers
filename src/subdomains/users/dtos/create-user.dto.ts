import type { ObjectPlain } from '@flex-development/tutils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
 * Data used to create a new user. A successful data transfer will insert a
 * {@link IUserRaw} object into the `DatabaseTable.USERS` table.
 */
export default class CreateUserDTO {
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

  @ApiProperty({ description: 'First name', minLength: 1, type: String })
  @IsString()
  @IsNotEmpty()
  readonly first_name: IUserRaw['first_name']

  @ApiProperty({ description: 'Last name', minLength: 1, type: String })
  @IsString()
  @IsNotEmpty()
  readonly last_name: IUserRaw['last_name']

  @ApiPropertyOptional({
    description: 'Secure password',
    minLength: 8,
    nullable: true,
    type: String
  })
  @IsString()
  @IsOptional()
  readonly password?: IUserRaw['password']

  constructor({
    email,
    first_name,
    last_name,
    password = null
  }: CreateUserDTO | ObjectPlain = {}) {
    this.email = email
    this.first_name = first_name
    this.last_name = last_name
    this.password = password
  }
}
