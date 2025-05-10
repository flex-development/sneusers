/**
 * @file Functional Tests - DeleteAccountHandler
 * @module sneusers/accounts/handlers/tests/functional/DeleteAccount
 */

import DeleteAccountCommand from '#accounts/commands/delete-account.command'
import Account from '#accounts/entities/account.entity'
import AccountDeletedEvent from '#accounts/events/account-deleted.event'
import TestSubject from '#accounts/handlers/delete-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import {
  CqrsModule,
  EventBus,
  EventsHandler,
  type IEventHandler
} from '@nestjs/cqrs'
import { Test, type TestingModule } from '@nestjs/testing'
import type { Mock, MockInstance } from 'vitest'

describe('functional:accounts/handlers/DeleteAccountHandler', () => {
  let handler: IEventHandler<AccountDeletedEvent>
  let ref: TestingModule
  let repository: AccountsRepository
  let seeder: Seeder<AccountDocument>
  let subject: TestSubject

  beforeAll(async () => {
    @EventsHandler(AccountDeletedEvent)
    class AccountDeletedHandler implements IEventHandler<AccountDeletedEvent> {
      /**
       * Handle an account deletion event.
       *
       * @public
       * @instance
       *
       * @param {AccountDeletedEvent} event
       *  The account deletion event
       * @return {undefined}
       */
      public handle: Mock = vi.fn().mockName('AccountDeletedHandler#handle')
    }

    ref = await Test.createTestingModule({
      imports: [CqrsModule.forRoot(), DatabaseModule.forFeature(Account)],
      providers: [AccountDeletedHandler, AccountsRepository, TestSubject]
    }).compile()

    handler = ref.get(AccountDeletedHandler)
    repository = ref.get(AccountsRepository)
    seeder = new Seeder(new AccountFactory(), repository)
    subject = ref.get(TestSubject)

    await ref.init()
  })

  describe('#execute', () => {
    let command: DeleteAccountCommand
    let del: MockInstance<AccountsRepository['delete']>
    let handle: MockInstance<IEventHandler<AccountDeletedEvent>['handle']>
    let publish: MockInstance<EventBus['publish']>

    beforeAll(() => {
      command = new DeleteAccountCommand()
    })

    beforeEach(async () => {
      await seeder.up(1)
      command.uid = String(seeder.seeds[0]!._id)

      handle = vi.spyOn(handler, 'handle')
      publish = vi.spyOn(ref.get(EventBus), 'publish')
      del = vi.spyOn(repository, 'delete')

      await subject.execute(command)
    })

    it('should publish account deleted event', () => {
      expect(publish.mock.calls).to.be.of.length(1)
      expect(publish.mock.lastCall).to.be.an('array').of.length(1)
      expect(publish.mock.lastCall![0]).to.be.instanceof(AccountDeletedEvent)
      expect(handle.mock.calls).to.be.of.length(1)
      expect(handle.mock.lastCall).to.be.an('array').of.length(1)
      expect(handle.mock.lastCall![0]).to.be.instanceof(AccountDeletedEvent)
    })

    it('should remove account from database', () => {
      expect(del).toHaveBeenCalledOnce()
      expect(del.mock.lastCall).to.be.an('array').of.length(1)
      expect(del.mock.lastCall).to.have.property('0', command.uid)
    })
  })
})
