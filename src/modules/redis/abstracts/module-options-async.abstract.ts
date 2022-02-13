import type { OrPromise } from '@flex-development/tutils'
import type { Provider, Type } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common'
import type { RedisScripts } from 'redis'
import type { RedisOptionsFactory } from '../factories'
import type RedisModuleOptions from './module-options.abstract'

/**
 * @file RedisModule Abstracts - RedisModuleOptionsAsync
 * @module sneusers/modules/redis/abstracts/RedisModuleOptionsAsync
 */

/**
 * `RedisModule` async options.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template S - [Lua Scripts][1]
 *
 * @abstract
 * @implements {Pick<ModuleMetadata, 'imports'>}
 */
abstract class RedisModuleOptionsAsync<S extends RedisScripts = RedisScripts>
  implements Pick<ModuleMetadata, 'imports'>
{
  extraProviders?: Provider[]
  imports?: ModuleMetadata['imports']
  inject?: any[]
  isGlobal?: boolean
  useClass?: Type<RedisOptionsFactory<S>>
  useExisting?: Type<RedisOptionsFactory<S>>
  useFactory?: (...args: any[]) => OrPromise<RedisModuleOptions<S>>
}

export default RedisModuleOptionsAsync
