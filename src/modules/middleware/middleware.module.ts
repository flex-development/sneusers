import { MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common'
import {
  CookieOptionsFactory,
  CsurfOptionsFactory,
  HelmetOptionsFactory
} from '@sneusers/factories'
import {
  CookieParserMiddleware,
  CsurfMiddleware,
  HelmetMiddleware,
  HttpLoggerMiddleware
} from '@sneusers/middleware'
import { ForRoutesConfig } from '@sneusers/types'
import {
  CookieOptionsProvider,
  CsurfOptionsProvider,
  HelmetOptionsProvider
} from './providers'

/**
 * @file MiddlewareModule
 * @module sneusers/modules/middleware/MiddlewareModule
 */

@Module({
  exports: [CookieOptionsFactory, CsurfOptionsFactory, HelmetOptionsFactory],
  providers: [
    CookieOptionsProvider(),
    CsurfOptionsProvider(),
    HelmetOptionsProvider()
  ]
})
export default class MiddlewareModule implements NestModule {
  constructor(
    protected readonly cookie: CookieOptionsFactory,
    protected readonly csurf: CsurfOptionsFactory,
    protected readonly helmet: HelmetOptionsFactory
  ) {}

  /**
   * Configures middleware.
   *
   * @static
   * @async
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @param {(Function | Type<any>)[]} [middlewares=[]] - Middleware to apply
   * @param {ForRoutesConfig} [config={}] - Routes config
   * @return {void} Empty promise when complete
   */
  static async configure(
    consumer: MiddlewareConsumer,
    middlewares: (Function | Type<any>)[] = [],
    config: ForRoutesConfig = {}
  ): Promise<void> {
    for (const Middleware of middlewares) {
      const routes = config[Middleware.name]
      const for_routes = typeof routes === 'function' ? await routes() : routes

      consumer.apply(Middleware).forRoutes(...(for_routes || ['*']))
    }
  }

  /**
   * Configures middleware.
   *
   * @async
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Empty promise when complete
   */
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    const middlewares = [
      HttpLoggerMiddleware,
      HelmetMiddleware,
      CookieParserMiddleware,
      CsurfMiddleware
    ]

    await MiddlewareModule.configure(consumer, middlewares, {
      [CookieParserMiddleware.name]: this.cookie.createParserRoutes,
      [CsurfMiddleware.name]: this.csurf.createCsurfRoutes,
      [HelmetMiddleware.name]: this.helmet.createHelmetRoutes
    })
  }
}
