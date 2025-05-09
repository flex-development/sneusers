/**
 * @file Unit Tests - AccountsRepository
 * @module sneusers/accounts/providers/tests/unit/AccountsRepository
 */

import Account from '#accounts/entities/account.entity'
import TestSubject from '#accounts/providers/accounts.repository'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import { Test, type TestingModule } from '@nestjs/testing'
import { ok } from 'devlop'

describe('unit:accounts/providers/AccountsRepository', () => {
  let factory: AccountFactory
  let ref: TestingModule
  let seeder: Seeder<AccountDocument>
  let subject: TestSubject

  afterAll(async () => {
    await seeder.down()
  })

  beforeAll(async () => {
    ref = await Test.createTestingModule({
      imports: [DatabaseModule.forFeature(Account)],
      providers: [TestSubject]
    }).compile()

    factory = new AccountFactory()
    subject = ref.get(TestSubject)
    seeder = await new Seeder(factory, subject).up()
  })

  describe('#findByEmail', () => {
    it('should return `null` if account is not found', async () => {
      // Arrange
      const email: string = faker.internet.email({ provider: 'test.app' })

      // Act + Expect
      expect(await subject.findByEmail(email)).to.be.null
    })

    it('should return `Account` instance if account is found', async () => {
      // Arrange
      const email: string = seeder.seeds[seeder.seeds.length - 3]!.email

      // Act
      ok(typeof email === 'string', 'expected `email`')
      const result = await subject.findByEmail(email)

      // Expect
      expect(result).to.be.instanceof(Account)
      expect(result).to.have.property('email', email)
    })
  })
})
