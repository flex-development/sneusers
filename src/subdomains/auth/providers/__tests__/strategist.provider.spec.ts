import { CacheModule } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { DatabaseTable, ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import EmailModule from '@sneusers/modules/email/email.module'
import { CacheConfigService } from '@sneusers/providers'
import { Token } from '@sneusers/subdomains/auth/entities'
import {
  JwtConfigService,
  TokensService
} from '@sneusers/subdomains/auth/providers'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../strategist.provider'

/**
 * @file Unit Tests - Strategist
 * @module sneusers/subdomains/auth/providers/tests/unit/Strategist
 */

describe('unit:subdomains/auth/providers/Strategist', () => {
  let app: NestExpressApplication
  let qi: QueryInterface
  let repo: typeof User
  let sequelize: Sequelize
  let subject: TestSubject
  let users: User[]

  before(async () => {
    const ntapp = await createApp({
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        EmailModule,
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        CryptoModule,
        SequelizeModule.forFeature([Token, User])
      ],
      providers: [TestSubject, TokensService, UsersService]
    })

    app = await ntapp.app.init()
    sequelize = ntapp.ref.get(Sequelize)
    qi = sequelize.getQueryInterface()
    repo = sequelize.models.User as typeof User
    subject = ntapp.ref.get(TestSubject)

    users = await seedTable<User>(repo, createUsers(MAGIC_NUMBER))
  })

  after(async () => {
    await resetSequence(qi, DatabaseTable.USERS)
    await app.close()
  })

  describe('#validateLocal', () => {
    it('should return User if login credentials are valid', async () => {
      // Arrange
      const user = users[0]

      // Act
      const result = await subject.validateLocal(user.email, user.password)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.equal(user.created_at)
      expect(result.email).to.equal(user.email)
      expect(result.email_verified).to.equal(user.email_verified)
      expect(result.first_name).to.equal(user.first_name)
      expect(result.id).to.equal(user.id)
      expect(result.last_name).to.equal(user.last_name)
      expect(result.password).to.equal(user.password)
      expect(result.updated_at).to.equal(user.updated_at)
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      let exception: Exception

      // Act
      try {
        await subject.validateLocal(this.faker.internet.exampleEmail())
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.NOT_FOUND)
    })

    it('should throw if login credentials are invalid', async () => {
      // Arrange
      const user = users[0]
      const password: NonNullable<User['password']> = 'user.password'
      let exception: Exception

      // Act
      try {
        await subject.validateLocal(user.email, password)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.UNAUTHORIZED)
      expect(exception!.data.credential).to.be.undefined
      expect(exception!.data.user.email).to.equal(user.email)
      expect(exception!.data.user.id).to.equal(user.id)
      expect(exception!.data.user.password).to.equal(password)
      expect(exception!.message).to.equal('Invalid login credentials')
    })
  })

  describe('#validatePayload', () => {
    it.skip('should return User given valid JwtPayload', async () => {
      //
    })

    it.skip('should throw if payload.sub is invalid', async () => {
      //
    })

    it.skip('should throw if token is not found', async () => {
      //
    })

    it.skip('should throw if token owners do not match', async () => {
      //
    })
  })

  describe('#validateToken', () => {
    it.skip('should return User and Token', async () => {
      //
    })

    it.skip('should throw if token owners do not match', async () => {
      //
    })
  })
})
