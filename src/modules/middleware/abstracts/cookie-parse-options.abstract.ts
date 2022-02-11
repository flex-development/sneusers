import type { OneOrMany } from '@flex-development/tutils'
import { CookieParseOptions as ICookieParseOptions } from 'cookie-parser'

/**
 * @file MiddlewareModule Abstracts - CookieParseOptions
 * @module sneusers/modules/middleware/abstracts/CookieParseOptions
 */

/**
 * [`cookie-parser`][1] middleware options.
 *
 * [1]: https://github.com/expressjs/cookie-parser
 *
 * @abstract
 * @implements {ICookieParseOptions}
 */
abstract class CookieParseOptions implements ICookieParseOptions {
  decode?(val: string): string
  secret?: OneOrMany<string>
}

export default CookieParseOptions
