/**
 * @file Unit Tests - JwtStrategy
 * @module sneusers/accounts/strategies/tests/unit/Jwt
 */

import Account from '#accounts/entities/account.entity'
import AccessDeniedException from '#accounts/errors/access-denied.exception'
import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import GetAccountHandler from '#accounts/handlers/get-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import TestSubject from '#accounts/strategies/jwt.strategy'
import DependenciesModule from '#modules/dependencies.module'
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
      imports: [DatabaseModule.forFeature(Account), DependenciesModule],
      providers: [
        AccountsRepository,
        GetAccountHandler,
        JwtOptionsFactory,
        TestSubject
      ]
    }).compile()

    factory = new AccountFactory()
    seeder = new Seeder(factory, ref.get(AccountsRepository))
    subject = ref.get(TestSubject)

    await ref.init()
    await seeder.up()
  })

  describe('#validate', () => {
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

    it('should throw on on uid mismatch', async () => {
      // Arrange
      const account1: Account = new Account(seeder.seeds[0]!)
      const account2: Account = new Account(seeder.seeds[1]!)
      const params: Record<string, string> = { uid: account1.uid }
      let error!: AccessDeniedException

      // Act
      try {
        await subject.validate({ params }, { sub: account2.uid })
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(AccessDeniedException)
    })
  })
})
