import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './entities'
import { UsersService } from './providers'

/**
 * @file Users Subdomain - UsersModule
 * @module sneusers/subdomains/users/UsersModule
 */

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService]
})
export default class UsersModule {}
