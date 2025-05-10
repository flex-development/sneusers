/**
 * @file Unit Tests - GetAccountHandler
 * @module sneusers/accounts/handlers/tests/unit/GetAccount
 */

import Account from '#accounts/entities/account.entity'
import MissingAccountException from '#accounts/errors/missing-account.exception'
import TestSubject from '#accounts/handlers/get-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import GetAccountQuery from '#accounts/queries/get-account.query'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import { Test, type TestingModule } from '@nestjs/testing'
import { ObjectId } from 'bson'

describe('unit:accounts/handlers/GetAccountHandler', () => {
  let ref: TestingModule
  let seeder: Seeder<AccountDocument>
  let subject: TestSubject

  afterAll(async () => {
    await seeder.down()
  })

  beforeAll(async () => {
    ref = await Test.createTestingModule({
      imports: [DatabaseModule.forFeature(Account)],
      providers: [AccountsRepository, TestSubject]
    }).compile()

    seeder = new Seeder(new AccountFactory(), ref.get(AccountsRepository))
    subject = ref.get(TestSubject)

    await seeder.up(1)
  })

  describe('#execute', () => {
    it('should return user account referenced by `query.uid`', async () => {
      // Arrange
      const account: Account = new Account(seeder.seeds[0]!)
      const query: GetAccountQuery = new GetAccountQuery(account.uid)

      // Act
      const result = await subject.execute(query)

      // Expect
      expect(result).to.be.instanceof(Account).and.eql(account)
    })

    it('should throw if an account is not found', async () => {
      // Arrange
      let error!: MissingAccountException

      // Act
      try {
        await subject.execute(new GetAccountQuery(new ObjectId()))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(MissingAccountException)
    })
  })
})
