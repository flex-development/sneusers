import { MockCreateUserDTO } from './types'

/**
 * @file Global Test Utilities - getCreateUserDTO
 * @module tests/utils/getCreateUserDTO
 */

/**
 * Generates a `CreateUserDTO` object.
 *
 * @return {MockCreateUserDTO} Mock `CreateUserDTO` object
 */
const getCreateUserDTO = (): MockCreateUserDTO => {
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()

  return {
    email: faker.internet.email(first_name, last_name),
    first_name,
    last_name
  }
}

export default getCreateUserDTO
