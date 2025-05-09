/**
 * @file AccountsModule
 * @module sneusers/accounts/AccountsModule
 */

import AccountsController from '#accounts/controllers/accounts.controller'
import Account from '#accounts/entities/account.entity'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import CreateAccountHandler from '#accounts/handlers/create-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AuthService from '#accounts/services/auth.service'
import DatabaseModule from '@flex-development/sneusers/database'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

/**
 * User accounts module.
 *
 * @class
 */
@Module({
  controllers: [AccountsController],
  imports: [
    DatabaseModule.forFeature(Account),
    JwtModule.registerAsync({ useClass: JwtOptionsFactory })
  ],
  providers: [AccountsRepository, AuthService, CreateAccountHandler]
})
class AccountsModule {}

export default AccountsModule
