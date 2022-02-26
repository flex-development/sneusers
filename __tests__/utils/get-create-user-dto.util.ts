import faker from '@faker-js/faker'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { MockCreateUserDTO } from './types'

/**
 * @file Global Test Utilities - getCreateUserDTO
 * @module tests/utils/getCreateUserDTO
 */

/**
 * Generates a `CreateUserDTO` object.
 *
 * @param {IUserRaw['id']} [id] - Unique user id
 * @return {MockCreateUserDTO} Mock `CreateUserDTO` object
 */
const getCreateUserDTO = (id?: IUserRaw['id']): MockCreateUserDTO => {
  const first_name = faker.name.firstName().toLowerCase()
  const last_name = faker.name.lastName().toLowerCase()

  return {
    email: faker.internet.email(first_name, last_name),
    first_name,
    id,
    last_name
  }
}

export default getCreateUserDTO
