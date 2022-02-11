import type { OrPromise } from '@flex-development/tutils'
import type { Provider, Type } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common'
import type { RedisOptionsFactory } from '@sneusers/modules/redis/factories'
import type RedisModuleOptions from './module-options.abstract'

/**
 * @file RedisModule Abstracts - RedisModuleOptionsAsync
 * @module sneusers/modules/redis/abstracts/RedisModuleOptionsAsync
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
