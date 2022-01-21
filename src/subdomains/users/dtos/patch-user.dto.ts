import { PartialType } from '@nestjs/swagger'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import CreateUserDTO from './create-user.dto'

/**
 * @file Users Subdomain DTOs - PatchUserDTO
 * @module sneusers/subdomains/users/dtos/PatchUserDTO
 */

/**
 * Data used to update an existing user.
 *
 * @template Internal - Allow internal-only updates
 *
 * @extends PartialType(CreateUserDTO)
 */
export default class PatchUserDTO<
  Internal extends 'internal' | never = never
> extends PartialType(CreateUserDTO) {
  email_verified?: Internal extends 'internal'
    ? IUserRaw['email_verified']
    : never
}
