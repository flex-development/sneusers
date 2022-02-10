import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { CookieType } from '@sneusers/enums'
import type { CookieParserOptions } from '@sneusers/interfaces'
import type { CookieOptions as CsurfCookieOptions } from 'csurf'
import type { CookieOptions } from 'express'

/**
 * @file Factories - CookieOptionsFactory
 * @module sneusers/factories/CookieOptionsFactory
 */

abstract class CookieOptionsFactory {
  abstract createOptions(type?: CookieType): CookieOptions | CsurfCookieOptions
  abstract createParserOptions(): CookieParserOptions
  abstract createParserRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default CookieOptionsFactory
