import type { OrUndefined } from '@flex-development/tutils'
import type { CookieOptions } from 'csurf'

/**
 * @file Interfaces - CsurfOptions
 * @module sneusers/interfaces/CsurfOptions
 */

/**
 * [`csurf`][1] configuration options.
 *
 * [1]: https://github.com/expressjs/csurf
 */
interface CsurfOptions {
  cookie?: CookieOptions
  ignoreMethods?: string[]
  ignoreRoutes?: RegExp | string[]
  value?: () => OrUndefined<string>
}

export default CsurfOptions
