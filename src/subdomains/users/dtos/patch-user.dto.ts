import { NullishString, ObjectPlain } from '@flex-development/tutils'
import { Type } from '@nestjs/common'
import { OmitType, PartialType } from '@nestjs/swagger'
import { OAuthProvider } from '@sneusers/subdomains/auth/enums'
import { Numeric } from '@sneusers/types'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import type { IUserRaw } from '../interfaces'
import CreateUserDTO from './create-user.dto'

/**
 * @file Users Subdomain DTOs - PatchUserDTO
 * @module sneusers/subdomains/users/dtos/PatchUserDTO
 */

/** Properties that can't be updated or only updated by the application */
type Internal =
  | 'created_at'
  | 'email_verified'
  | 'id'
  | 'provider'
  | 'updated_at'

/**
 * @internal
 * @property {Omit<Partial<CreateUserDTO>, Internal>} PatchUserDTOB - DTO base
 */
const PatchUserDTOB: Type<Omit<Partial<CreateUserDTO>, Internal>> = OmitType(
  PartialType(CreateUserDTO),
  ['created_at', 'email_verified', 'id', 'provider', 'updated_at']
)

/**
 * Data used to update an existing user.
 *
 * @template I - Allow internal-only updates
 *
 * @extends PatchUserDTOB
 */
class PatchUserDTO<I extends 'internal' | never = never> extends PatchUserDTOB {
  @IsBoolean()
  @IsOptional()
  email_verified?: I extends 'internal' ? IUserRaw['email_verified'] : I

  @IsEnum(OAuthProvider)
  @IsOptional()
  provider?: I extends 'internal' ? IUserRaw['provider'] : I

  /**
   * Creates a new dto instance.
   *
   * @param {ObjectPlain} [values={}] - DTO values
   * @param {NullishString} [values.display_name] - Display name
   * @param {string} [values.email] - Unique email address
   * @param {boolean} [values.email_verified] - User email verified?
   * @param {NullishString} [values.first_name] - First name
   * @param {Numeric | number} [values.id] - Unique identifier
   * @param {NullishString} [values.last_name] - Last name
   * @param {NullishString} [values.password] - Password
   * @param {NullishString} [values.provider] - Authentication provider
   */
  constructor({
    display_name,
    email,
    email_verified,
    first_name,
    id,
    last_name,
    password,
    provider
  }: ObjectPlain = {}) {
    super()

    Object.assign(this, {
      display_name,
      email,
      email_verified,
      first_name,
      id,
      last_name,
      password,
      provider
    })
  }
}

export default PatchUserDTO
