/**
 * @file Modules - ConfigModule
 * @module sneusers/modules/ConfigModule
 */

import Config from '#models/config.model'
import type { DynamicModule } from '@nestjs/common'
import { ConfigModule as ConfigurationModule } from '@nestjs/config'

/**
 * Application configuration module.
 *
 * @async
 *
 * @const {Promise<DynamicModule>} ConfigModule
 */
const ConfigModule: Promise<DynamicModule> = ConfigurationModule.forRoot({
  cache: process.env.NODE_ENV === 'production',
  ignoreEnvFile: true,
  isGlobal: true,
  validate: env => new Config(env),
  validatePredefined: true
})

export default ConfigModule
