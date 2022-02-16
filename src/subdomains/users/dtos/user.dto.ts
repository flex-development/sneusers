import { Type } from '@nestjs/common'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '../entities'
import { IUser } from '../interfaces'

/**
 * @file Users Subdomain DTOs - UserDTO
 * @module sneusers/subdomains/users/dtos/UserDTO
 */

/**
 * {@link User} entity payload.
 *
 * @extends {Partial<Type<Omit<IUser, 'password'>>>}
 */
class UserDTO extends PickType(User, [
  'created_at',
  'display_name',
  'email',
  'email_verified',
  'first_name',
  'full_name',
  'id',
  'last_name',
  'provider',
  'updated_at'
]) {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  declare id: User['id']
}

export default UserDTO
