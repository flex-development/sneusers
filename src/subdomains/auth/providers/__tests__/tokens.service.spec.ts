import type { INestApplication } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type {
  CreateTokenDTO,
  PatchTokenDTO
} from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { User } from '@sneusers/subdomains/users/entities'
import type { SequelizeError } from '@sneusers/types'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createTokens from '@tests/utils/create-tokens.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../tokens.service'

/**
 * @file Unit Tests - TokensService
 * @module sneusers/auth/providers/tests/unit/TokensService
 */

describe('unit:subdomains/auth/providers/TokensService', () => {
  let app: INestApplication
  let queryInterface: QueryInterface
  let subject: TestSubject
  let tokens: Token[]
  let users: User[]

  before(async () => {
    const ntapp = await createApp({
      imports: [SequelizeModule.forFeature([Token])],
      providers: [TestSubject]
    })

    app = await ntapp.app.init()
    subject = ntapp.ref.get(TestSubject)
    queryInterface = ntapp.ref.get(Sequelize).getQueryInterface()

    users = await seedTable<User>(
      subject.repository.User,
      createUsers(MAGIC_NUMBER)
    )
    tokens = await seedTable<Token>(subject.repository, createTokens(users))
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await resetSequence(queryInterface, DatabaseTable.TOKENS)
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
      expect(exception!.data.error).to.equal(SequelizeErrorName.EmptyResult)
      expect(exception!.data.id).to.equal(id)
      expect(exception!.message).to.match(new RegExp(id.toString()))
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
      expect(exception!.data.error).to.equal(SequelizeErrorName.EmptyResult)
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
      expect(exception!.data.error).to.equal(SequelizeErrorName.EmptyResult)
      expect(exception!.data.id).to.equal(id)
      expect(exception!.message).to.match(new RegExp(id.toString()))
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
})
