import type { OrPromise } from '@flex-development/tutils'
import type { RouteInfo } from '@nestjs/common/interfaces'
import type { CsurfOptions } from '@sneusers/interfaces'

/**
 * @file Factories - CsurfOptionsFactory
 * @module sneusers/factories/CsurfOptionsFactory
 */

abstract class CsurfOptionsFactory {
  abstract createCsurfOptions(): CsurfOptions
  abstract createCsurfRoutes(): OrPromise<(RouteInfo | string)[]>
}

export default CsurfOptionsFactory
