import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './entities'

/**
 * @file Users Subdomain - UsersModule
 * @module sneusers/subdomains/users/UsersModule
 */

@Module({ imports: [SequelizeModule.forFeature([User])] })
export default class UsersModule {}
