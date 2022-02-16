/**
 * @file MiddlewareModule Enums - SameSitePolicy
 * @module sneusers/modules/middleware/enums/SameSitePolicy
 */

/**
 * Cookie `sameSite` policices.
 *
 * @see https://github.com/expressjs/csurf#cookie
 * @see https://github.com/expressjs/session#cookiesamesite
 *
 * @enum {Lowercase<string>}
 */
enum SameSitePolicy {
  LAX = 'lax',
  NONE = 'none',
  STRICT = 'strict'
}

export default SameSitePolicy
