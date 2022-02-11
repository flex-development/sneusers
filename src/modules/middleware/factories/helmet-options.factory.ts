import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { HelmetOptions } from '../abstracts'

/**
 * @file MiddlewareModule Factories - HelmetOptionsFactory
 * @module sneusers/modules/middleware/factories/HelmetOptionsFactory
 */

/**
 * Creates [`helmet`][1] library options and [middleware][2] routing options.
 *
 * [1]: https://github.com/helmetjs/helmet
 * [2]: https://docs.nestjs.com/middleware
 *
 * @abstract
 */
abstract class HelmetOptionsFactory {
  abstract createHelmetOptions(): HelmetOptions
  abstract createHelmetRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default HelmetOptionsFactory
