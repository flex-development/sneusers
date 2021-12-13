import { Module } from '@nestjs/common'
import ConfigModule from './config.module'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 * @see https://docs.nestjs.com/modules
 * @see https://docs.nestjs.com/techniques/database#sequelize-integration
 */

@Module({ imports: [ConfigModule], providers: [] })
export default class AppModule {}
