import { PartialType } from '@nestjs/swagger'
import CreateUserDTO from './create-user.dto'

/**
 * @file Users Subdomain DTOs - PatchUserDTO
 * @module sneusers/subdomains/users/dtos/PatchUserDTO
 */

/**
 * Data used to update an existing user.
 *
 * @extends PartialType(CreateUserDTO)
 */
export default class PatchUserDTO extends PartialType(CreateUserDTO) {}
