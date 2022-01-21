import type ITokenRaw from './token-raw.interface'

/**
 * @file Auth Subdomain Interfaces - IToken
 * @module sneusers/subdomains/auth/interfaces/IToken
 */

/**
 * Object representing a `Token` entity (see {@link ITokenRaw}), and all of its
 * [virtual fields][1].
 *
 * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 *
 * @extends ITokenRaw
 */
interface IToken extends ITokenRaw {
  expires: number
}

export default IToken
