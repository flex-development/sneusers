import { HttpModule } from '@nestjs/axios'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from '@sneusers/controllers'
import * as MIDDLEWARE from '@sneusers/middleware'
import { AppService } from '@sneusers/providers'
import { AuthModule, UsersModule } from '@sneusers/subdomains'
import CryptoModule from './crypto.module'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 */

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot(AppService.configModuleOptions),
    SequelizeModule.forRootAsync(AppService.sequelizeModuleOptions),
    HttpModule,
    TerminusModule,
    CryptoModule,
    UsersModule,
    AuthModule
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
