import { ExceptionCode } from '@flex-development/exceptions/enums'
import { CacheModule } from '@nestjs/common'
import type { ModuleRef } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { Exception } from '@sneusers/exceptions'
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
import tableSeed from '@tests/utils/table-seed.util'
import tableTruncate from '@tests/utils/table-truncate.util'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../strategist.provider'

/**
 * @file Unit Tests - Strategist
 * @module sneusers/subdomains/auth/providers/tests/unit/Strategist
 */

describe('unit:subdomains/auth/providers/Strategist', () => {
  let app: NestExpressApplication
  let subject: TestSubject
  let repo: typeof User
  let users: User[]

  before(async () => {
    app = await createApp({
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        SequelizeModule.forFeature([Token, User])
      ],
      async onModuleInit(ref: ModuleRef): Promise<void> {
        const sequelize = ref.get(Sequelize, { strict: false })

        repo = sequelize.models.User as typeof User
        subject = ref.get(TestSubject, { strict: false })

        users = await tableSeed<User>(repo, createUsers(MAGIC_NUMBER))
      },
      providers: [TestSubject, TokensService, UsersService]
    })
  })

  after(async () => {
    await tableTruncate<User>(repo)
    await app.close()
  })

  describe('#validateGitHub', () => {
    it.skip('should return new User', async () => {
      //
    })

    it.skip('should return updated User', async () => {
      //
    })
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
      expect(result.provider).to.equal(user.provider)
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
