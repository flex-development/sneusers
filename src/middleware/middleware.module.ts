/**
 * @file Middleware - MiddlewareModule
 * @module sneusers/middleware/MiddlewareModule
 * @see https://docs.nestjs.com/middleware
 */

import { HelmetOptionsProvider } from '#src/providers'
import {
  Global,
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestMiddleware,
  type NestModule,
  type Type
} from '@nestjs/common'
import type { RouteInfo } from '@nestjs/common/interfaces'
import HelmetMiddleware from './helmet.middleware'

/**
 * Global middleware module.
 *
 * @class
 * @implements {NestModule}
 */
@Global()
@Module({ providers: [HelmetOptionsProvider] })
class MiddlewareModule implements NestModule {
  /**
   * Middleware configurations.
   *
   * @public
   * @static
   * @readonly
   * @member {[Type<NestMiddleware>, RouteInfo][]} middlewares
   */
  public static readonly middlewares: [Type<NestMiddleware>, RouteInfo][] = [
    [HelmetMiddleware, { method: RequestMethod.ALL, path: '*' }]
  ]

  /**
   * Helper for configuring global middleware.
   *
   * @see {@linkcode MiddlewareConsumer}
   * @see {@linkcode NestMiddleware}
   * @see {@linkcode RouteInfo}
   * @see https://docs.nestjs.com/middleware#middleware-consumer
   *
   * @public
   * @static
   *
   * @param {MiddlewareConsumer} consumer - Middleware helper
   * @param {[Type<NestMiddleware>, RouteInfo][]} config - Middleware configs
   * @return {void} Nothing when complete
   */
  public static configure(
    consumer: MiddlewareConsumer,
    config: [Type<NestMiddleware>, RouteInfo][]
  ): void {
    for (const [M, route] of config) consumer.apply(M).forRoutes(route)
    return void config
  }

  /**
   * Configures global middleware.
   *
   * @see {@linkcode MiddlewareConsumer}
   * @see https://docs.nestjs.com/middleware#middleware-consumer
   *
   * @public
   *
   * @param {MiddlewareConsumer} consumer - Middleware helper
   * @return {void} Nothing when complete
   */
  public configure(consumer: MiddlewareConsumer): void {
    return void MiddlewareModule.configure(
      consumer,
      MiddlewareModule.middlewares
    )
  }
}

export default MiddlewareModule
