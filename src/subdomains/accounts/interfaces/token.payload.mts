/**
 * @file Interfaces - TokenPayload
 * @module sneusers/accounts/interfaces/TokenPayload
 */

import type { Account } from '@flex-development/sneusers/accounts'
import type { JsonObject } from '@flex-development/sneusers/types'

/**
 * JWT payload.
 *
 * @extends {JsonObject}
 */
interface TokenPayload extends JsonObject {
  /**
   * The hostname of the API the token is intended for.
   */
  aud: string

  /**
   * The email address of the user the token was created for.
   */
  email: string

  /**
   * [Unix timestamp][timestamp] indicating when the token expires.
   *
   * [timestamp]: https://unixtimestamp.com
   */
  exp: number

  /**
   * [Unix timestamp][timestamp] indicating when the token was issued.
   *
   * [timestamp]: https://unixtimestamp.com
   */
  iat: number

  /**
   * The hostname of the API that issued the token.
   */
  iss: string

  /**
   * The role of the user the token was created for.
   */
  role: Account['role']

  /**
   * The id of the account the token was created for.
   */
  sub: Account['uid']
}

export type { TokenPayload as default }
