import { Type } from '@nestjs/common'
import { OmitType, PartialType } from '@nestjs/swagger'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { IsBoolean, IsOptional } from 'class-validator'
import CreateUserDTO from './create-user.dto'

/**
 * @file Users Subdomain DTOs - PatchUserDTO
 * @module sneusers/subdomains/users/dtos/PatchUserDTO
 */

/**
 * @internal
 * @property {Type<Omit<Partial<CreateUserDTO>, 'id'>>} PatchUserDTOB - DTO base
 */
const PatchUserDTOB: Type<Omit<Partial<CreateUserDTO>, 'id'>> = OmitType(
  PartialType(CreateUserDTO),
  ['id']
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
}

export default PatchUserDTO
