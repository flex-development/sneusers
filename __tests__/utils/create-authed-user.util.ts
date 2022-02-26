import { isNIL } from '@flex-development/tutils/guards'
import SQL from '@nearform/sql'
import { DatabaseSequence } from '@sneusers/modules/db/enums'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import USER_PASSWORD from '@tests/fixtures/user-password.fixture'
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

  if (isNIL(id)) {
    const sql = SQL`SELECT nextval('${SQL.unsafe(DatabaseSequence.USERS)}')`
    const next = await qi.sequelize.query(sql.text, { plain: true, raw: true })

    id = next!.nextval as number
  }

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
