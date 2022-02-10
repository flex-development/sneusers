import { CanActivate, ClassProvider, Injectable } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { Request } from 'express'

/**
 * @file Guards - ThrottlerProxyGuard
 * @module sneusers/guards/ThrottlerProxyGuard
 */

@Injectable()
class ThrottlerProxyGuard extends ThrottlerGuard implements CanActivate {
  /**
   * Creates a globally-scoped class provider.
   *
   * Use this custom provider instead of `useGlobalGuards` to enable depedency
   * injection for this class.
   *
   * @see https://docs.nestjs.com/guards#binding-guards
   *
   * @static
   * @return {ClassProvider<ThrottlerProxyGuard>} Application guard
   */
  static createProvider(): ClassProvider<ThrottlerProxyGuard> {
    return { provide: APP_GUARD, useClass: ThrottlerProxyGuard }
  }

  /**
   * Gets a user's ip address from an `X-Forward-For` header value or `req.ip`.
   *
   * @see https://docs.nestjs.com/security/rate-limiting#proxies
   * @see http://expressjs.com/guide/behind-proxies.html
   *
   * @protected
   * @param {Request} req - Incoming request
   * @return {string} User ip address
   */
  protected getTracker(req: Request): string {
    return (req.ips.length > 0 ? req.ips[0] : req.ip) as string
  }
}

export default ThrottlerProxyGuard
