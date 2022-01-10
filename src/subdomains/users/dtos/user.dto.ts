import type { NIL } from '@flex-development/tutils'
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import User from '@sneusers/subdomains/users/entities/user.dao'

/**
 * @file Users Subdomain Data Transfer Objects - UserDTO
 * @module sneusers/subdomains/users/dtos/UserDTO
 */

const KEYS: (keyof User)[] = [...User.RAW_KEYS, 'name']

export class UserDTOBase extends PartialType(PickType(User, KEYS)) {}

/**
 * {@link User} entity payload type.
 *
 * @template WithPassword - Include password in type definition
 *
 * @extends {UserDTOBase}
 */
export default class UserDTO<
  WithPassword extends boolean = false
> extends UserDTOBase {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  declare id: User['id']

  /** @internal */
  declare password?: WithPassword extends true
    ? WithPassword extends true | false
      ? User['password'] | NIL
      : User['password']
    : NIL
}
