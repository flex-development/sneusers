import { CreateTokenDTO } from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Global Test Utilities - createTokens
 * @module tests/utils/createTokens
 */

/**
 * Creates {@link CreateTokenDTO} objects for all users in `users`.
 *
 * @param {Pick<IUserRaw, 'id'>} [users=[]] - Users to create tokens for
 * @return {CreateTokenDTO[]} Array containing `CreateTokenDTO` objects
 */
const createTokens = (users: Pick<IUserRaw, 'id'>[] = []): CreateTokenDTO[] => {
  const types = Token.TYPES.filter(type => type !== TokenType.ACCESS)

  return users.map(({ id: user }) => ({
    type: types[Math.floor(Math.random() * types.length)],
    user
  }))
}

export default createTokens
