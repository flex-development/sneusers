import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersController } from './controllers'
import { User } from './entities'
import { UsersService } from './providers'

/**
 * @file Users Subdomain - UsersModule
 * @module sneusers/subdomains/users/UsersModule
 */

@Module({
  controllers: [UsersController],
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService]
})
export default class UsersModule {}
