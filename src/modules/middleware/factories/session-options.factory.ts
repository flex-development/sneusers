import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { SessionOptions } from '../abstracts'

/**
 * @file MiddlewareModule Factories - SessionOptionsFactory
 * @module sneusers/modules/middleware/factories/SessionOptionsFactory
 */

/**
 * Creates [`session`][1] library options and [middleware][2] routing options.
 *
 * [1]: https://github.com/expressjs/session
 * [2]: https://docs.nestjs.com/middleware
 *
 * @abstract
 */
abstract class SessionOptionsFactory {
  abstract createSessionOptions(): SessionOptions
  abstract createSessionRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default SessionOptionsFactory
