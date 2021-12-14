import { Module } from '@nestjs/common'
import ConfigModule from './config.module'
import DatabaseModule from './database.module'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 * @see https://docs.nestjs.com/modules
 */

@Module({ imports: [ConfigModule, DatabaseModule], providers: [] })
export default class AppModule {}
