import USER_PASSWORD from '@fixtures/user-password.fixture'
import AuthService from '@sneusers/subdomains/auth/providers/auth.service'
import User from '@sneusers/subdomains/users/entities/user.dao'
import pick from 'lodash.pick'
import { AuthedUser } from './types'

/**
 * @file Global Test Utilities - createAccessToken
 * @module tests/utils/createAccessToken
 */

/**
 * Creates an access token for `user`.
 *
 * @async
 * @param {AuthService} auth - Current auth service
 * @param {User} user - User to create access token for
 * @return {Promise<AuthedUser>} Promise containing user with acccess token
 */
const createAccessToken = async (
  auth: AuthService,
  user: User
): Promise<AuthedUser> => {
  return {
    ...pick({ ...user.toJSON(), updated_at: null }, User.KEYS_RAW),
    // @ts-expect-error Property 'tokens' is protected and only accessible
    // within class 'AuthService' and its subclasses ts(2445)
    access_token: await auth.tokens.createAccessToken(user),
    password: USER_PASSWORD
  } as AuthedUser
}

export default createAccessToken
