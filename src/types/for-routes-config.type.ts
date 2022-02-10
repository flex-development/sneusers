import type { OrPromise, OrUndefined } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'

/**
 * @file Type Definitions - ForRoutesConfig
 * @module sneusers/types/ForRoutesConfig
 */

/**
 * `MiddlewareConfigProxy#forRoutes` configuration object.
 *
 * @see https://docs.nestjs.com/middleware
 */
type ForRoutesConfig = {
  [x: string]: OrUndefined<
    (() => OrPromise<(RouteInfo | string)[]>) | (RouteInfo | string)[]
  >
}

export default ForRoutesConfig
