import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { HelmetOptions } from 'helmet'

/**
 * @file Factories - HelmetOptionsFactory
 * @module sneusers/factories/HelmetOptionsFactory
 */

abstract class HelmetOptionsFactory {
  abstract createHelmetOptions(): HelmetOptions
  abstract createHelmetRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default HelmetOptionsFactory
