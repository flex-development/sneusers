import type { OrUndefined } from '@flex-development/tutils'
import type { CookieOptions } from 'csurf'

/**
 * @file MiddlewareModule Abstracts - CsurfOptions
 * @module sneusers/modules/middleware/abstracts/CsurfOptions
 */

/**
 * [`csurf`][1] configuration options.
 *
 * [1]: https://github.com/expressjs/csurf
 *
 * @abstract
 */
abstract class CsurfOptions {
  cookie?: CookieOptions
  ignoreMethods?: string[]
  ignoreRoutes?: RegExp | string[]
  value?: () => OrUndefined<string>
}

export default CsurfOptions
