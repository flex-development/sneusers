import type { OneOrMany } from '@flex-development/tutils'
import { CookieParseOptions } from 'cookie-parser'

/**
 * @file Interfaces - CookieParserOptions
 * @module sneusers/interfaces/CookieParserOptions
 */

/**
 * [`cookie-parser`][1] middleware options.
 *
 * [1]: https://github.com/expressjs/cookie-parser
 *
 * @extends CookieParseOptions
 */
interface CookieParserOptions extends CookieParseOptions {
  secret?: OneOrMany<string>
}

export default CookieParserOptions
