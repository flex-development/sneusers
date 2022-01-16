import { OrUndefined } from '@flex-development/tutils'
import {
  CacheInterceptor,
  CACHE_KEY_METADATA,
  ExecutionContext,
  Injectable
} from '@nestjs/common'
import type { Request } from 'express'

/**
 * @file Interceptors - HttpCacheInterceptor
 * @module sneusers/interceptors/HttpCacheInterceptor
 */

@Injectable()
class HttpCacheInterceptor extends CacheInterceptor {
  /**
   * Creates a custom cache key using a request URL and its query parameters.
   *
   * @protected
   * @param {ExecutionContext} context - Methods for accessing route handler
   * @return {OrUndefined<string>} Custom cache key
   */
  protected trackBy(context: ExecutionContext): OrUndefined<string> {
    const key = this.reflector.get(CACHE_KEY_METADATA, context.getHandler())

    if (key) {
      const req = context.switchToHttp().getRequest<Request>()
      return `${key}_${req.url.slice(1, req.url.length)}`
    }

    return super.trackBy(context)
  }
}

export default HttpCacheInterceptor
