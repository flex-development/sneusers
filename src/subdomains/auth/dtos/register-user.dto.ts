import { NullishString, ObjectPlain } from '@flex-development/tutils'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { Numeric } from '@sneusers/types'
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

  /**
   * Creates a new dto instance.
   *
   * @param {ObjectPlain} [values={}] - DTO values
   * @param {NullishString} [values.display_name=null] - Display name
   * @param {string} [values.email] - Unique email address
   * @param {NullishString} [values.first_name=null] - First name
   * @param {Numeric | number} [values.id] - Unique identifier
   * @param {NullishString} [values.last_name=null] - Last name
   * @param {string} [values.password] - Password
   * @param {NullishString} [values.provider=null] - Authentication provider
   */
  constructor({
    display_name = null,
    email,
    first_name = null,
    id,
    last_name = null,
    password,
    provider = null
  }: ObjectPlain = {}) {
    super()

    Object.assign(this, {
      display_name,
      email,
      first_name,
      id,
      last_name,
      password,
      provider
    })
  }
}

export default RegisterUserDTO
