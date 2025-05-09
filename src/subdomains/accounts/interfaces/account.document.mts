/**
 * @file Interfaces - AccountDocument
 * @module sneusers/accounts/interfaces/AccountDocument
 */

import type { Role } from '@flex-development/sneusers/accounts'
import type { IDocument } from '@flex-development/sneusers/database'

/**
 * A collection document representing a user account.
 *
 * @see {@linkcode IDocument}
 *
 * @extends {IDocument}
 */
interface AccountDocument extends IDocument {
  /**
   * The email address associated with the account.
   */
  email: string

  /**
   * The password associated with the account.
   */
  password: string

  /**
   * The role of the user.
   */
  role: Role
}

export type { AccountDocument as default }
