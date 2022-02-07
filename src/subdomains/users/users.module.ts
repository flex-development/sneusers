import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CsurfMiddleware } from '@sneusers/middleware'
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
export default class UsersModule implements NestModule {
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
