/**
 * @file Unit Tests - AccountsController
 * @module sneusers/accounts/controllers/tests/unit/AccountsController
 */

import CreateAccountCommand from '#accounts/commands/create-account.command'
import DeleteAccountCommand from '#accounts/commands/delete-account.command'
import TestSubject from '#accounts/controllers/accounts.controller'
import AccountCreatedPayload from '#accounts/dto/account-created.payload'
import Account from '#accounts/entities/account.entity'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import CreateAccountHandler from '#accounts/handlers/create-account.handler'
import DeleteAccountHandler from '#accounts/handlers/delete-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AuthService from '#accounts/services/auth.service'
import DependenciesModule from '#modules/dependencies.module'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import { JwtModule } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'

describe('unit:accounts/controllers/AccountsController', () => {
  let ref: TestingModule
  let subject: TestSubject

  beforeAll(async () => {
    ref = await Test.createTestingModule({
      controllers: [TestSubject],
      imports: [
        DatabaseModule.forFeature(Account),
        DependenciesModule,
        JwtModule.registerAsync({ useClass: JwtOptionsFactory })
      ],
      providers: [
        AccountsRepository,
        AuthService,
        CreateAccountHandler,
        DeleteAccountHandler
      ]
    }).compile()

    subject = ref.get(TestSubject)

    await ref.init()
  })

  describe('#create', () => {
    let body: CreateAccountCommand

    beforeAll(async () => {
      body = new CreateAccountCommand()
      body.email = faker.internet.email()
      body.password = faker.internet.password({ length: 9 })
      body.type = AccountFactory.role
    })

    it('should return new account payload', async () => {
      // Act
      const result = await subject.create(body)

      // Expect
      expect(result).to.be.instanceof(AccountCreatedPayload)
    })
  })

  describe('#delete', () => {
    let params: DeleteAccountCommand
    let seeder: Seeder<AccountDocument>

    beforeAll(async () => {
      seeder = new Seeder(new AccountFactory(), ref.get(AccountsRepository))
      await seeder.up(1)

      params = new DeleteAccountCommand()
      params.uid = String(seeder.seeds[0]!._id)
    })

    it('should return `null`', async () => {
      expect(await subject.delete(params)).to.be.null
    })
  })
})
