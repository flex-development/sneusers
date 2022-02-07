import { Is } from '@sneusers/decorators'
import { IsOptional } from 'class-validator'
import CreateUserDTO from './create-user.dto'
import PatchUserDTO from './patch-user.dto'

/**
 * @file Users Subdomain DTOs - UpsertUserDTO
 * @module sneusers/subdomains/users/dtos/UpsertUserDTO
 */

/**
 * Data used to upsert a user.
 *
 * @template I - Allow internal-only updates
 *
 * @extends PatchUserDTO<I>
 */
class UpsertUserDTO<
  I extends 'internal' | never = never
> extends PatchUserDTO<I> {
  @Is({ types: ['number', 'string'] })
  @IsOptional()
  readonly id?: CreateUserDTO['id']
}

export default UpsertUserDTO
