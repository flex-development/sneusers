/**
 * @file Functional Tests - CreateAccountHandler
 * @module sneusers/accounts/handlers/tests/functional/CreateAccountHandler
 */

import CreateAccountCommand from '#accounts/commands/create-account.command'
import Account from '#accounts/entities/account.entity'
import AccountCreatedEvent from '#accounts/events/account-created.event'
import TestSubject from '#accounts/handlers/create-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AccountFactory from '#tests/utils/account.factory'
import DatabaseModule from '@flex-development/sneusers/database'
import { CqrsModule, EventsHandler, type IEventHandler } from '@nestjs/cqrs'
import { Test, type TestingModule } from '@nestjs/testing'
import type { Mock, MockInstance } from 'vitest'

describe('functional:accounts/handlers/CreateAccountHandler', () => {
  let handler: IEventHandler<AccountCreatedEvent>
  let ref: TestingModule
  let repository: AccountsRepository
  let subject: TestSubject

  beforeAll(async () => {
    @EventsHandler(AccountCreatedEvent)
    class AccountCreatedHandler implements IEventHandler<AccountCreatedEvent> {
      /**
       * Handle an account creation event.
       *
       * @public
       * @instance
       *
       * @param {AccountCreatedEvent} event
       *  The account creation event
       * @return {undefined}
       */
      public handle: Mock = vi.fn().mockName('AccountCreatedHandler#handle')
    }

    ref = await Test.createTestingModule({
      imports: [CqrsModule.forRoot(), DatabaseModule.forFeature(Account)],
      providers: [AccountCreatedHandler, AccountsRepository, TestSubject]
    }).compile()

    handler = ref.get(AccountCreatedHandler)
    repository = ref.get(AccountsRepository)
    subject = ref.get(TestSubject)

    await ref.init()
  })

  describe('#execute', () => {
    let command: CreateAccountCommand
    let commit: MockInstance<Account['commit']>
    let handle: MockInstance<IEventHandler<AccountCreatedEvent>['handle']>
    let insert: MockInstance<AccountsRepository['insert']>

    beforeAll(() => {
      command = new CreateAccountCommand()
      command.password = faker.internet.password({ length: 7 })
      command.type = AccountFactory.role
    })

    beforeEach(async () => {
      commit = vi.spyOn(Account.prototype, 'commit')
      handle = vi.spyOn(handler, 'handle')
      insert = vi.spyOn(repository, 'insert')

      command.email = faker.internet.email()
      await subject.execute(command)
    })

    it('should add account to database', () => {
      expect(insert).toHaveBeenCalledOnce()
      expect(insert.mock.lastCall).to.be.an('array').of.length(1)
      expect(insert.mock.lastCall![0]).to.be.instanceof(Account)
    })

    it('should publish account created event', () => {
      expect(commit).toHaveBeenCalledOnce()
      expect(commit.mock.lastCall).to.be.an('array').of.length(0)
      expect(handle).toHaveBeenCalledOnce()
      expect(handle.mock.lastCall).to.be.an('array').of.length(1)
      expect(handle.mock.lastCall![0]).to.be.instanceof(AccountCreatedEvent)
    })
  })
})
