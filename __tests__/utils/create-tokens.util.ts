import faker from '@faker-js/faker'
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
 * @param {Pick<IUserRaw, 'id'>[]} [users=[]] - Users to create tokens for
 * @return {CreateTokenDTO[]} Array containing `CreateTokenDTO` objects
 */
const createTokens = (users: Pick<IUserRaw, 'id'>[] = []): CreateTokenDTO[] => {
  const dtos: CreateTokenDTO[] = []
  const types = Token.TYPES.filter(type => type !== TokenType.ACCESS)
  const inflection = types.length * 2

  for (let i = 0; i < inflection; i++) {
    if (i < types.length) dtos.push({ type: types[i], user: users[i].id })
    else dtos.push({ type: types[i - types.length], user: users[i].id })
  }

  for (let j = inflection; j < users.length; j++) {
    dtos.push({ type: faker.helpers.randomize(types), user: users[j].id })
  }

  return dtos
}

export default createTokens
