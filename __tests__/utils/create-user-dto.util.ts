import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Global Test Utilities - createUserDTO
 * @module tests/utils/createUserDTO
 */

/**
 * Generates a {@link CreateUserDTO} object.
 *
 * @return {CreateUserDTO} Mock `CreateUserDTO` object
 */
const createUserDTO = (): CreateUserDTO => {
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()

  return {
    email: faker.internet.email(first_name, last_name),
    first_name,
    last_name
  }
}

export default createUserDTO
