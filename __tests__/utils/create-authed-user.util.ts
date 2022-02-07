import { AuthService } from '@sneusers/subdomains/auth/providers'
import getCreateUserDTO from './get-create-user-dto.util'
import { MockAuthedUser } from './types'

/**
 * @file Global Test Utilities - createAuthedUser
 * @module tests/utils/createAuthedUser
 */

/**
 * Generates a mock authenticated user.
 *
 * @param {AuthService} auth - Current auth service
 * @param {number} id - Id of authenticated user
 * @return {Promise<MockAuthedUser>} Promise containing mock authenticated user
 */
const createAuthedUser = async (
  auth: AuthService,
  id: number
): Promise<MockAuthedUser> => {
  return {
    ...getCreateUserDTO(),
    access_token: await auth._tokens.createAccessToken({ id }),
    id
  }
}

export default createAuthedUser
