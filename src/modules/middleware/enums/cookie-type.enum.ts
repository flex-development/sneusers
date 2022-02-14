/**
 * @file MiddlewareModule Enums - CookieType
 * @module sneusers/modules/middleware/enums/CookieType
 */

/**
 * Types of cookies that can be created.
 *
 * @enum {Lowercase<string>}
 */
enum CookieType {
  CSRF = 'csrf-token',
  LOGOUT = 'logout',
  REFRESH = 'refresh',
  SESSION = 'session'
}

export default CookieType
