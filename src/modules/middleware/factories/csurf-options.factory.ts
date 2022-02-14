import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { CsurfOptions } from '../abstracts'

/**
 * @file MiddlewareModule Factories - CsurfOptionsFactory
 * @module sneusers/modules/middleware/factories/CsurfOptionsFactory
 */

/**
 * Creates [`csurf`][1] library options and [middleware][2] routing options.
 *
 * [1]: https://github.com/expressjs/csurf
 * [2]: https://docs.nestjs.com/middleware
 *
 * @abstract
 */
abstract class CsurfOptionsFactory {
  abstract createCsurfOptions(): CsurfOptions
  abstract createCsurfRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default CsurfOptionsFactory
