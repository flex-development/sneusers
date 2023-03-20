/**
 * @file AppModule
 * @module sneusers/AppModule
 */

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './providers'

/**
 * Main application module.
 *
 * @class
 */
@Module({
  controllers: [],
  imports: [ConfigModule.forRoot(AppService.optionsConfigModule)],
  providers: []
})
export default class AppModule {}
