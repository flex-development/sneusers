/**
 * @file Unit Tests - JwtStrategy
 * @module sneusers/accounts/strategies/tests/unit/Jwt
 */

import Account from '#accounts/entities/account.entity'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import AccountsRepository from '#accounts/providers/accounts.repository'
import TestSubject from '#accounts/strategies/jwt.strategy'
import ConfigModule from '#modules/config.module'
import AccountFactory from '#tests/utils/account.factory'
import Seeder from '#tests/utils/seeder'
import type {
  AccountDocument,
  TokenPayload
} from '@flex-development/sneusers/accounts'
import DatabaseModule from '@flex-development/sneusers/database'
import { Test, type TestingModule } from '@nestjs/testing'

describe('unit:accounts/strategies/JwtStrategy', () => {
  let factory: AccountFactory
  let ref: TestingModule
  let seeder: Seeder<AccountDocument>
  let subject: TestSubject

  afterAll(async () => {
    await seeder.down()
  })

  beforeAll(async () => {
    ref = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule.forFeature(Account)],
      providers: [AccountsRepository, JwtOptionsFactory, TestSubject]
    }).compile()

    factory = new AccountFactory()
    seeder = new Seeder(factory, ref.get(AccountsRepository))
    subject = ref.get(TestSubject)

    await seeder.up()
  })

  describe('#validate', () => {
    it('should return `null` if account is not found', async () => {
      // Arrange
      const account: Account = new Account(factory.makeOne())
      const params: Record<string, string> = { uid: account.uid }
      const payload: Pick<TokenPayload, 'sub'> = { sub: account.uid }

      // Act + Expect
      expect(await subject.validate({ params }, payload)).to.be.null
    })

    it('should return `null` on uid mismatch', async () => {
      // Arrange
      const account1: Account = new Account(seeder.seeds[0]!)
      const account2: Account = new Account(seeder.seeds[1]!)
      const params: Record<string, string> = { uid: account1.uid }
      const payload: Pick<TokenPayload, 'sub'> = { sub: account2.uid }

      // Act + Expect
      expect(await subject.validate({ params }, payload)).to.be.null
    })

    it('should return account of authenticated user', async () => {
      // Arrange
      const account: Account = new Account(seeder.seeds[2]!)
      const params: Record<string, string> = { uid: account.uid }
      const payload: Pick<TokenPayload, 'sub'> = { sub: account.uid }

      // Act
      const result = await subject.validate({ params }, payload)

      // Expect
      expect(result).to.be.instanceof(Account).and.eql(account)
    })
  })
})
