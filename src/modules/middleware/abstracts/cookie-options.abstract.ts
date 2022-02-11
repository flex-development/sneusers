import type { CookieOptions as ICsurfCookieOptions } from 'csurf'
import type { CookieOptions as ICookieOptions } from 'express'

/**
 * @file MiddlewareModule Abstracts - CookieOptions
 * @module sneusers/modules/middleware/abstracts/CookieOptions
 */

/**
 * Cookie options.
 *
 * @see https://github.com/expressjs/csurf#cookie
 *
 * @abstract
 * @implements {ICookieOptions}
 * @implements {ICsurfCookieOptions}
 */
abstract class CookieOptions implements ICookieOptions, ICsurfCookieOptions {
  domain?: ICookieOptions['domain']
  encode?: ICookieOptions['encode']
  expires?: ICookieOptions['expires']
  httpOnly?: ICookieOptions['httpOnly']
  key?: ICsurfCookieOptions['key']
  maxAge?: ICookieOptions['maxAge']
  path?: ICookieOptions['path']
  sameSite?: ICookieOptions['sameSite']
  secure?: ICookieOptions['secure']
  signed?: ICookieOptions['signed']
}

export default CookieOptions
