/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 */

import DependenciesModule from '#modules/dependencies.module'
import AccountsModule from '@flex-development/sneusers/accounts'
import { Module } from '@nestjs/common'

/**
 * Main application module.
 *
 * @class
 */
@Module({ imports: [AccountsModule, DependenciesModule] })
class AppModule {}

export default AppModule
