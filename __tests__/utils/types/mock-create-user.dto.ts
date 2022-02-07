import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'

/**
 * @file Global Test Types - MockCreateUserDTO
 * @module tests/utils/types/MockCreateUserDTO
 */

/**
 * Mock {@link CreateUserDTO}.
 *
 * @extends CreateUserDTO
 */
class MockCreateUserDTO extends CreateUserDTO {
  declare first_name: NonNullable<CreateUserDTO['first_name']>
  declare last_name: NonNullable<CreateUserDTO['last_name']>
}

export default MockCreateUserDTO
