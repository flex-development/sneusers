/**
 * @file Unit Tests - DeleteAccountHandler
 * @module sneusers/accounts/handlers/tests/unit/DeleteAccount
 */

import DeleteAccountCommand from '#accounts/commands/delete-account.command'
import Account from '#accounts/entities/account.entity'
import TestSubject from '#accounts/handlers/delete-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import { CqrsModule } from '@nestjs/cqrs'
import { Test, type TestingModule } from '@nestjs/testing'

describe('unit:accounts/handlers/DeleteAccountHandler', () => {
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
    seeder = await new Seeder(factory, ref.get(AccountsRepository)).up(1)

    subject = ref.get(TestSubject)
  })

  describe('#execute', () => {
    let account: Account
    let command: DeleteAccountCommand

    beforeAll(() => {
      account = new Account(seeder.seeds[0]!)
      command = new DeleteAccountCommand()
      command.uid = account.uid
    })

    it('should return the deleted user account', async () => {
      // Act
      const result = await subject.execute(command)

      // Expect
      expect(result).to.be.instanceof(Account).and.eql(account)
    })
  })
})
