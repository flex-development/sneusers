/**
 * @file AccountsModule
 * @module sneusers/accounts/AccountsModule
 */

import AccountsController from '#accounts/controllers/accounts.controller'
import Account from '#accounts/entities/account.entity'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import CreateAccountHandler from '#accounts/handlers/create-account.handler'
import DeleteAccountHandler from '#accounts/handlers/delete-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AuthService from '#accounts/services/auth.service'
import JwtStrategy from '#accounts/strategies/jwt.strategy'
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
  providers: [
    AccountsRepository,
    AuthService,
    CreateAccountHandler,
    DeleteAccountHandler,
    JwtOptionsFactory,
    JwtStrategy
  ]
})
class AccountsModule {}

export default AccountsModule
