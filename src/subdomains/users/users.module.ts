import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import EmailModule from '@sneusers/modules/email/email.module'
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
  imports: [EmailModule, SequelizeModule.forFeature([User])],
  providers: [UsersService]
})
export default class UsersModule {}
