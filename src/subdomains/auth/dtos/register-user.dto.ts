import { ApiProperty, OmitType } from '@nestjs/swagger'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { IsNotEmpty, IsString } from 'class-validator'

/**
 * @file Auth Subdomain DTOs - RegisterUserDTO
 * @module sneusers/subdomains/auth/dtos/RegisterUserDTO
 */

/**
 * Data used to register a user using an email and password.
 *
 * @extends {Omit<CreateUserDTO, 'password'>}
 */
class RegisterUserDTO extends OmitType(CreateUserDTO, ['password']) {
  @ApiProperty({ description: 'Secure password', minLength: 8, type: String })
  @IsString()
  @IsNotEmpty()
  readonly password: NonNullable<CreateUserDTO['password']>
}

export default RegisterUserDTO
