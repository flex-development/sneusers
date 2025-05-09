/**
 * @file Unit Tests - CreateAccountHandler
 * @module sneusers/accounts/handlers/tests/unit/CreateAccountHandler
 */

import CreateAccountCommand from '#accounts/commands/create-account.command'
import Account from '#accounts/entities/account.entity'
import TestSubject from '#accounts/handlers/create-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import { Exception, ExceptionId } from '@flex-development/sneusers/errors'
import { HttpStatus } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { Test, type TestingModule } from '@nestjs/testing'

describe('unit:accounts/handlers/CreateAccountHandler', () => {
  let factory: AccountFactory
  let ref: TestingModule
  let seeder: Seeder<AccountDocument>
  let subject: TestSubject

  afterAll(async () => {
    await seeder.down()
  })

  beforeAll(async () => {
    ref = await Test.createTestingModule({
      imports: [CqrsModule.forRoot(), DatabaseModule.forFeature(Account)],
      providers: [AccountsRepository, TestSubject]
    }).compile()

    factory = new AccountFactory()
    seeder = await new Seeder(factory, ref.get(AccountsRepository)).up()

    subject = ref.get(TestSubject)
  })

  describe('#execute', () => {
    let conflict: CreateAccountCommand
    let success: CreateAccountCommand

    beforeAll(() => {
      conflict = new CreateAccountCommand()
      success = new CreateAccountCommand()

      conflict.email = seeder.seeds[0]!.email
      conflict.password = faker.internet.password({ length: 8 })
      conflict.type = AccountFactory.role

      success.email = faker.internet.email()
      success.password = faker.internet.password({ length: 9 })
      success.type = AccountFactory.role
    })

    it('should return new user account', async () => {
      // Act
      const result = await subject.execute(success)

      // Expect
      expect(result).to.be.instanceof(Account)
      expect(result).to.have.property('email', success.email)
      expect(result).to.have.property('password').be.a('string')
      expect(result).to.have.property('password').not.eq(success.password)
      expect(result).to.have.property('role', success.type)
      expect(result).to.have.property('updated_at', null)
    })

    it('should throw on email conflict', async () => {
      // Arrange
      let error!: Exception

      // Act
      try {
        await subject.execute(conflict)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(Exception)
      expect(error).to.have.property('cause').with.keys(['email'])
      expect(error).to.have.nested.property('cause.email', conflict.email)
      expect(error).to.have.property('code', HttpStatus.CONFLICT)
      expect(error).to.have.property('id', ExceptionId.EMAIL_CONFLICT)
      expect(error).to.have.property('message', 'Email address must be unique')
    })
  })
})
