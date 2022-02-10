import { Type } from '@nestjs/common'
import { ApiProperty, PickType } from '@nestjs/swagger'
import User from '@sneusers/subdomains/users/entities/user.dao'
import { IUser } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Users Subdomain DTOs - UserDTO
 * @module sneusers/subdomains/users/dtos/UserDTO
 */

/**
 * {@link User} entity payload type.
 *
 * @extends {Partial<Type<Omit<IUser, 'password'>>>}
 */
class UserDTO extends PickType(User, [
  'created_at',
  'email',
  'email_verified',
  'first_name',
  'id',
  'last_name',
  'name',
  'updated_at'
]) {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  declare id: User['id']
}

export default UserDTO
