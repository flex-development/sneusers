import { ApiProperty } from '@nestjs/swagger'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import {
  IsEmail,
  IsNotEmpty,
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
}
