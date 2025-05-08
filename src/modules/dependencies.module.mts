/**
 * @file Modules - DependenciesModule
 * @module sneusers/modules/DependenciesModule
 */

import ConfigModule from '#modules/config.module'
import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

/**
 * Global dependencies module.
 *
 * @class
 */
@Global()
@Module({ imports: [ConfigModule, CqrsModule.forRoot()] })
class DependenciesModule {}

export default DependenciesModule
