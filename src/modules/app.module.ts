import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import * as MIDDLEWARE from '@sneusers/middleware'
import { AppService } from '@sneusers/providers'
import { UsersModule } from '@sneusers/subdomains'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 * @see https://docs.nestjs.com/modules
 */

@Module({
  imports: [
    ConfigModule.forRoot(AppService.configModuleOptions),
    SequelizeModule.forRootAsync(AppService.sequelizeModuleOptions),
    UsersModule
  ],
  providers: [AppService]
})
export default class AppModule implements NestModule {
  /**
   * Configures global middleware.
   *
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Nothing when complete
   */
  configure(consumer: MiddlewareConsumer): void {
    for (const m of Object.values(MIDDLEWARE)) {
      consumer.apply(m).forRoutes({ method: RequestMethod.ALL, path: '*' })
    }
  }
}
