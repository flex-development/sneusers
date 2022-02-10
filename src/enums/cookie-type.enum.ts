/**
 * @file Enums - CookieType
 * @module sneusers/enums/CookieType
 */

/**
 * Types of cookies that can be created.
 *
 * @enum {Lowercase<string>}
 */
enum CookieType {
  CSRF = 'csrf-token',
  LOGOUT = 'logout',
  REFRESH = 'refresh'
}

export default CookieType
