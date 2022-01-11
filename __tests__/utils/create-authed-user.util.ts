import { LoginDTO, LoginPayload } from '@sneusers/subdomains/auth/dtos'
import jwt from '@tests/fixtures/jwt-service.fixture'
import createUserDTO from './create-user-dto.util'

/**
 * @file Global Test Utilities - createAuthedUser
 * @module tests/utils/createAuthedUser
 */

/**
 * Generates a {@link CreateUserDTO} object.
 *
 * @param {number} id - ID of authed user
 * @return {LoginDTO} Mock login response
 */
const createAuthedUser = (id: number): LoginDTO => {
  const payload: LoginPayload = { ...createUserDTO(), id }

  /** @see https://github.com/nestjs/jwt#api-spec */
  return { access_token: jwt.sign(payload), ...payload }
}

export default createAuthedUser
