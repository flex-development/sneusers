import type { OrPromise } from '@flex-development/tutils'
import type { ModuleMetadata, Provider, Type } from '@nestjs/common'
import type { RedisOptionsFactory } from '@sneusers/modules/redis/factories'
import type RedisModuleOptions from './module-options.interface'

/**
 * @file RedisModule Interfaces - RedisModuleOptionsAsync
 * @module sneusers/modules/redis/interfaces/RedisModuleOptionsAsync
 */

/**
 * `RedisModule` async options.
 *
 * @extends {Pick<ModuleMetadata, 'imports'>}
 */
interface RedisModuleOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  extraProviders?: Provider[]
  inject?: any[]
  isGlobal?: boolean
  skipClient?: boolean
  useClass?: Type<RedisOptionsFactory>
  useExisting?: Type<RedisOptionsFactory>
  useFactory?: (...args: any[]) => OrPromise<RedisModuleOptions>
}

export default RedisModuleOptionsAsync
