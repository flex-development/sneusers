import { Type } from '@nestjs/common'
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import User from '@sneusers/subdomains/users/entities/user.dao'
import { IUser } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Users Subdomain DTOs - UserDTO
 * @module sneusers/subdomains/users/dtos/UserDTO
 */

/**
 * @internal
 * @property {Type<Pick<User, keyof IUser>>} UserDTOB - DTO base
 */
const UserDTOB: Type<Pick<User, keyof IUser>> = PickType(User, [
  'created_at',
  'email',
  'first_name',
  'id',
  'last_name',
  'name',
  'updated_at'
] as (keyof IUser)[])

/**
 * {@link User} entity payload type.
 *
 * @extends PartialType(UserDTOB)
 */
class UserDTO extends PartialType(UserDTOB) {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  declare id: User['id']
}

export default UserDTO
