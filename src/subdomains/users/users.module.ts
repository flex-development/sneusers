import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { CsurfMiddleware } from '@sneusers/middleware'
import type { EnvironmentVariables } from '@sneusers/models'
import { UsersController } from './controllers'
import { User } from './entities'
import { UsersService } from './providers'

/**
 * @file Users Subdomain - UsersModule
 * @module sneusers/subdomains/users/UsersModule
 */

@Module({
  controllers: [UsersController],
  exports: [SequelizeModule, UsersService],
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService]
})
export default class UsersModule {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Configures middleware.
   *
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Nothing when complete
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CsurfMiddleware).forRoutes(UsersController)
    return
  }
}
