import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import getCreateUserDTO from './get-create-user-dto.util'

/**
 * @file Global Test Utilities - createUsers
 * @module tests/utils/createUsers
 */

/**
 * Creates `max` number of {@link CreateUserDTO} objects.
 *
 * @param {number} [max=5] - Number of dtos to create
 * @return {CreateUserDTO[]} Array containing `CreateUserDTO` objects
 */
const createUsers = (max: number = 5): CreateUserDTO[] => {
  const users: CreateUserDTO[] = []

  for (let id = 0; id < max; id++) users.push(getCreateUserDTO())

  return users
}

export default createUsers
