/// <reference path='../../node_modules/@types/cache-manager-redis-store/node_modules/@types/redis/index.d.ts' />

declare module 'cache-manager-redis-store' {
  import type { CacheStoreFactory } from '@nestjs/common/cache/interfaces'

  const RedisCacheStore: CacheStoreFactory

  export = RedisCacheStore
}
