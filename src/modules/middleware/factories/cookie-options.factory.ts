import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { CookieOptions } from 'express'
import type { CookieParseOptions } from '../abstracts'
import type { CookieType } from '../enums'

/**
 * @file MiddlewareModule Factories - CookieOptionsFactory
 * @module sneusers/modules/middleware/factories/CookieOptionsFactory
 */

/**
 * Creates options for each {@link CookieType}, as well as [middleware][1]
 * routing options for [`cookie-parser`][2].
 *
 * [1]: https://docs.nestjs.com/middleware
 * [2]: https://github.com/expressjs/cookie-parser
 *
 * @see https://github.com/expressjs/csurf#cookie
 * @see https://github.com/expressjs/session#cookie
 *
 * @abstract
 */
abstract class CookieOptionsFactory {
  abstract createOptions(type?: CookieType): CookieOptions
  abstract createParserOptions(): CookieParseOptions
  abstract createParserRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default CookieOptionsFactory
