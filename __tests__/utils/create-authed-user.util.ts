import USER_PASSWORD from '@fixtures/user-password.fixture'
import { isNIL } from '@flex-development/tutils/guards'
import { DatabaseSequence } from '@sneusers/modules/db/enums'
import { nextval } from '@sneusers/modules/db/utils'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import pick from 'lodash.pick'
import { QueryInterface } from 'sequelize'
import getCreateUserDTO from './get-create-user-dto.util'
import { AuthedUser } from './types'

/**
 * @file Global Test Utilities - createAuthedUser
 * @module tests/utils/createAuthedUser
 */

/**
 * Generates a mock authenticated user.
 *
 * @async
 * @param {QueryInterface} qi - Current queryInterface
 * @param {AuthService} auth - Current auth service
 * @param {number} [id] - Id of authenticated user
 * @return {Promise<AuthedUser>} Promise containing mock authenticated user
 */
const createAuthedUser = async (
  qi: QueryInterface,
  auth: AuthService,
  id?: number
): Promise<AuthedUser> => {
  // @ts-expect-error Property 'users' is protected and only accessible within
  // class 'AuthService' and its subclasses ts(2445)
  const users = auth.users.repository

  if (isNIL(id)) id = await nextval(qi, DatabaseSequence.USERS)

  const dto = { ...getCreateUserDTO(id), password: USER_PASSWORD }
  const entity = await users.create(dto, { isNewRecord: true, silent: true })
  const user = pick({ ...entity.toJSON(), updated_at: null }, users.KEYS_RAW)

  return {
    ...user,
    // @ts-expect-error Property 'tokens' is protected and only accessible
    // within class 'AuthService' and its subclasses ts(2445)
    access_token: await auth.tokens.createAccessToken(user),
    password: USER_PASSWORD
  } as AuthedUser
}

export default createAuthedUser
