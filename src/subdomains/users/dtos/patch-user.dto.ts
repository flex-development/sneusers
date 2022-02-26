import { Type } from '@nestjs/common'
import { OmitType, PartialType } from '@nestjs/swagger'
import { OAuthProvider } from '@sneusers/subdomains/auth/enums'
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
}

export default PatchUserDTO
