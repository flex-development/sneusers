import { ExceptionCode } from '@flex-development/exceptions/enums'
import { CacheModule } from '@nestjs/common'
import type { ModuleRef } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { Exception } from '@sneusers/exceptions'
import { SequelizeError } from '@sneusers/modules/db/enums'
import { CacheConfigService } from '@sneusers/providers'
import type {
  CreateTokenDTO,
  PatchTokenDTO
} from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { JwtConfigService } from '@sneusers/subdomains/auth/providers'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createTokens from '@tests/utils/create-tokens.util'
import createUsers from '@tests/utils/create-users.util'
import tableSeed from '@tests/utils/table-seed.util'
import tableTruncate from '@tests/utils/table-truncate.util'
import TestSubject from '../tokens.service'

/**
 * @file Unit Tests - TokensService
 * @module sneusers/auth/providers/tests/unit/TokensService
 */

describe('unit:subdomains/auth/providers/TokensService', () => {
  let app: NestExpressApplication
  let subject: TestSubject
  let tokens: Token[]
  let users: User[]

  before(async () => {
    app = await createApp({
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        SequelizeModule.forFeature([Token, User])
      ],
      async onModuleInit(ref: ModuleRef): Promise<void> {
        const seed_users = createUsers(MAGIC_NUMBER)

        subject = ref.get(TestSubject, { strict: false })

        users = await tableSeed<User>(subject.repository.User, seed_users)
        tokens = await tableSeed<Token>(subject.repository, createTokens(users))
      },
      providers: [TestSubject, UsersService]
    })
  })

  after(async () => {
    await tableTruncate<User>(subject.repository.User)
    await tableTruncate<Token>(subject.repository)
    await app.close()
  })

  describe('#create', () => {
    it('should return Token if token was created', async () => {
      // Arrange
      const dto: CreateTokenDTO = {
        ttl: 86_400 * 2,
        type: TokenType.VERIFICATION,
        user: users[0].id
      }

      // Act
      const result = await subject.create(dto)

      // Expect
      expect(result).to.be.instanceOf(Token)
      expect(result.created_at).to.be.a('number')
      expect(result.expires).not.to.be.NaN
      expect(result.revoked).to.be.false
      expect(result.ttl).to.be.a('number')
      expect(result.type).to.equal(dto.type)
      expect(result.user).to.equal(dto.user)
    })

    it('should throw if token owner does not exist', async () => {
      // Arrange
      const dto: CreateTokenDTO = { type: TokenType.REFRESH, user: -1 }
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.create(dto)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.UNPROCESSABLE_ENTITY)
      expect(exception!.data.dto).deep.equal(dto)
      expect(exception!.message).to.match(new RegExp(dto.user.toString()))
    })
  })

  describe('#createAccessToken', () => {
    it.skip('should return raw access token', () => {
      //
    })
  })

  describe('#createRefreshToken', () => {
    it.skip('should return raw refresh token', () => {
      //
    })
  })

  describe('#createVerificationToken', () => {
    it.skip('should return raw verification token', () => {
      //
    })
  })

  describe('#find', () => {
    it('should return PaginatedDTO<Token>', async () => {
      // Act
      const result = await subject.find()

      // Expect
      expect(result).to.be.an('object')
      expect(result.count).to.be.a('number')
      expect(result.limit).to.equal(result.results.length)
      expect(result.offset).to.equal(0)
      expect(result.results).each(user => user.to.be.instanceOf(Token))
      expect(result.total).to.be.a('number')
    })
  })

  describe('#findByPayload', () => {
    it.skip('should return Token given valid JwtPayload', async () => {
      //
    })

    it.skip('should throw if payload.jti is invalid', async () => {
      //
    })

    it.skip('should throw if token is not found', async () => {
      //
    })

    it.skip('should throw if token does not match requested type', async () => {
      //
    })
  })

  describe('#findOne', () => {
    it('should return Token given id of existing token', async () => {
      expect(await subject.findOne(tokens[0].id)).to.be.instanceOf(Token)
    })

    it('should return null if token is not found', async function (this) {
      // Arrange
      const id: Token['id'] = this.faker.datatype.number() * -42

      // Act + Expect
      expect(await subject.findOne(id)).to.be.null
    })

    it('should throw if token is not found', async () => {
      // Arrange
      const id: Token['id'] = tokens.length * -72
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.findOne(id, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.data.error).to.equal(SequelizeError.EmptyResult)
      expect(exception!.data.id).to.equal(id)
      expect(exception!.message).to.match(new RegExp(id.toString()))
    })
  })

  describe('#findOwnerByPayload', () => {
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

  describe('#patch', () => {
    it('should return Token if token was updated', async () => {
      // Arrange
      const id: Token['id'] = tokens[tokens.length - 1].id
      const dto: PatchTokenDTO = { revoked: true }

      // Act
      const result = await subject.patch(id, dto)

      // Expect
      expect(result).to.be.instanceOf(Token)
      expect(result.created_at).to.be.a('number')
      expect(result.expires).not.to.be.NaN
      expect(result.id).to.be.a('number')
      expect(result.revoked).to.equal(dto.revoked)
      expect(result.type).to.be.a('string')
      expect(result.ttl).to.be.a('number')
      expect(result.user).to.be.a('number')
    })

    it('should throw if token is not found', async function (this) {
      // Arrange
      const id: Token['id'] = this.faker.internet.port()
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.patch(id)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.data.error).to.equal(SequelizeError.EmptyResult)
      expect(exception!.data.id).to.equal(id)
      expect(exception!.message).to.match(new RegExp(id.toString()))
    })
  })

  describe('#remove', () => {
    it('should return Token if token was deleted', async () => {
      // Arrange
      const id: Token['id'] = tokens[4].id

      // Act
      const result = await subject.remove(id)

      // Expect
      expect(result).to.be.instanceOf(Token)
      expect(result.created_at).to.be.a('number')
      expect(result.expires).not.to.be.NaN
      expect(result.id).to.be.a('number')
      expect(result.revoked).to.be.a('boolean')
      expect(result.type).to.be.a('string')
      expect(result.ttl).to.be.a('number')
      expect(result.user).to.be.a('number')
    })

    it('should throw if token is not found', async function (this) {
      // Arrange
      const id: Token['id'] = this.faker.datatype.number() * -1
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.remove(id)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.data.error).to.equal(SequelizeError.EmptyResult)
      expect(exception!.data.id).to.equal(id)
      expect(exception!.message).to.match(new RegExp(id.toString()))
    })
  })

  describe('#resolve', () => {
    it.skip('should return User and Token', async () => {
      //
    })

    it.skip('should throw if Token is revoked', async () => {
      //
    })
  })

  describe('#revoke', () => {
    it('should return revoked Token', async () => {
      // Arrange
      const id: Token['id'] = tokens[1].id

      // Act
      const result = await subject.revoke(id)

      // Expect
      expect(result).to.be.instanceOf(Token)
      expect(result.revoked).to.be.true
    })
  })

  describe('#validate', () => {
    it.skip('should return User and Token', async () => {
      //
    })

    it.skip('should throw if token owners do not match', async () => {
      //
    })
  })

  describe('#verify', () => {
    it.skip('should return raw jwt', async () => {
      //
    })

    it.skip('should throw if token is expired', async () => {
      //
    })

    it.skip('should throw if token is malformed', async () => {
      //
    })
  })
})
