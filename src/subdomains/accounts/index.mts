/**
 * @file Entry Point - Accounts
 * @module sneusers/accounts
 */

export { default } from '#accounts/accounts.module'
export type { default as Account } from '#accounts/entities/account.entity'
export type { default as Role } from '#accounts/enums/role'
export type {
  default as AccountDocument
} from '#accounts/interfaces/account.document'
export type {
  default as TokenPayload
} from '#accounts/interfaces/token.payload'
