import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import User from '@sneusers/subdomains/users/entities/user.dao'

/**
 * @file Users Subdomain Data Transfer Objects - UserDTO
 * @module sneusers/subdomains/users/dtos/UserDTO
 */

const KEYS: (keyof User)[] = [
  'created_at',
  'email',
  'first_name',
  'id',
  'last_name',
  'name',
  'updated_at'
]

export class UserDTOBase extends PartialType(PickType(User, KEYS)) {}

/**
 * {@link User} entity payload type.
 *
 * @extends UserDTOBase
 */
export default class UserDTO extends UserDTOBase {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  declare id: User['id']
}
