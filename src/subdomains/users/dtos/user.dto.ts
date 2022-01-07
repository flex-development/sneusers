import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import User from '@sneusers/subdomains/users/entities/user.dao'

/**
 * @file Users Subdomain Data Transfer Objects - UserDTO
 * @module sneusers/subdomains/users/dtos/UserDTO
 */

const KEYS: (keyof User)[] = [...User.RAW_KEYS, 'name']

export default class UserDTO extends PartialType(PickType(User, KEYS)) {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  declare id: User['id']
}
