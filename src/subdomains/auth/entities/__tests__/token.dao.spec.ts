import type { INestApplication } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type {
  JwtPayloadRefresh,
  JwtPayloadVerif
} from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { User } from '@sneusers/subdomains/users/entities'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createTokens from '@tests/utils/create-tokens.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../token.dao'

/**
 * @file Unit Tests - Token
 * @module sneusers/subdomains/auth/entities/tests/unit/Token
 */

describe('unit:subdomains/auth/entities/Token', () => {
  let Subject: typeof TestSubject
  let app: INestApplication
  let queryInterface: QueryInterface
  let sequelize: Sequelize
  let tokens: TestSubject[]
  let users: User[]

  before(async () => {
    const ntapp = await createApp({
      imports: [SequelizeModule.forFeature([TestSubject])]
    })

    app = await ntapp.app.init()
    sequelize = ntapp.ref.get(Sequelize)
    queryInterface = sequelize.getQueryInterface()
    Subject = sequelize.models.Token as typeof TestSubject
    Object.assign(Subject, { sequelize })

    users = await seedTable<User>(Subject.User, createUsers(MAGIC_NUMBER))
    tokens = await seedTable<TestSubject>(Subject, createTokens(users))
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await resetSequence(queryInterface, DatabaseTable.TOKENS)
    await app.close()
  })

  describe('.findByPayload', () => {
    const type = TokenType.REFRESH

    it('should return Token given valid JwtPayloadToken', async () => {
      // Arrange
      const { id, user } = tokens.find(t => t.type === type)!
      const payload: JwtPayloadRefresh = { jti: `${id}`, sub: `${user}`, type }

      // Act
      const result = await Subject.findByPayload(payload)

      // Expect
      expect(result).to.be.instanceOf(Token)
      expect(result!.created_at).to.be.a('number')
      expect(result!.expires).not.to.be.NaN
      expect(result!.id).to.equal(Number.parseInt(payload.jti))
      expect(result!.revoked).to.be.a('boolean')
      expect(result!.ttl).to.be.a('number')
      expect(result!.type).to.equal(payload.type)
      expect(result!.user).to.equal(Number.parseInt(payload.sub))
    })

    it('should throw if payload.jti is invalid', async () => {
      // Arrange
      const { user } = tokens.find(t => t.type === type)!
      const payload: JwtPayloadRefresh = { jti: `${-1}`, sub: `${user}`, type }
      let exception: Exception

      // Act
      try {
        await Subject.findByPayload(payload)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.UNPROCESSABLE_ENTITY)
      expect(exception!.data.payload).to.deep.equal(payload)
      expect(exception!.message).to.equal('Token malformed')
    })

    it('should throw if token is not found', async () => {
      // Arrange
      const payload: JwtPayloadRefresh = { jti: `${4200}`, sub: `${0}`, type }
      let exception: Exception

      // Act
      try {
        await Subject.findByPayload(payload, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.NOT_FOUND)
    })

    it('should throw if token does not match requested type', async () => {
      // Arrange
      const { id } = tokens.find(t => t.type === TokenType.VERIFICATION)!
      const { user } = tokens.find(t => t.type === type)!
      const payload: JwtPayloadRefresh = { jti: `${id}`, sub: `${user}`, type }
      let exception: Exception

      // Act
      try {
        await Subject.findByPayload(payload)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.CONFLICT)
      expect(exception!.data.payload).to.deep.equal(payload)
      expect(exception!.data.token.id).to.equal(id)
      expect(exception!.data.token.type).to.be.a('string')
      expect(exception!.message).to.equal('Token type mismatch')
    })
  })

  describe('.findByPk', () => {
    it('should return Token given id of existing token', async () => {
      // Arrange
      const token = tokens[0]

      // Act
      const result = await Subject.findByPk(token.id)

      // Expect
      expect(result).to.be.instanceOf(Token)
      expect(result!.created_at).to.equal(token.created_at)
      expect(result!.expires).to.equal(token.expires)
      expect(result!.id).to.equal(token.id)
      expect(result!.revoked).to.equal(token.revoked)
      expect(result!.ttl).to.equal(token.ttl)
      expect(result!.type).to.equal(token.type)
      expect(result!.user).to.equal(token.user)
    })

    it('should return null if token is not found', async function (this) {
      expect(await Subject.findByPk(tokens.length * -420)).to.be.null
    })

    it('should throw if token is not found', async function (this) {
      // Arrange
      const pk: Token['id'] = this.faker.datatype.number(-5)
      let exception: Exception

      // Act
      try {
        await Subject.findByPk(pk, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.data.error).to.equal(SequelizeErrorName.EmptyResult)
      expect(exception!.data.id).to.equal(pk)
      expect(exception!.data.options).to.be.an('object')
      expect(exception!.data.pk).to.not.be.undefined
      expect(exception!.message).to.equal(`Token with id [${pk}] not found`)
    })
  })

  describe('.findOwnerByPayload', () => {
    const type = TokenType.VERIFICATION

    it('should return User given valid JwtPayloadToken', async () => {
      // Arrange
      const { id, user } = tokens.find(t => t.type === type)!
      const payload: JwtPayloadVerif = {
        jti: `${id}`,
        sub: `${users[user - 1].email}`,
        type
      }

      // Act
      const result = await Subject.findOwnerByPayload(payload)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result!.created_at).to.be.a('number')
      expect(result!.email).to.equal(payload.sub.toLowerCase())
      expect(result!.email_verified).to.be.false
      expect(result!.first_name).to.be.a('string')
      expect(result!.id).to.be.a('number')
      expect(result!.last_name).to.be.a('string')
      expect(result!.password).to.be.null
      expect(result!.updated_at).to.be.null
    })

    it('should throw if payload.sub is invalid', async () => {
      // Arrange
      const token = tokens.find(t => t.type === type)!
      const payload: JwtPayloadVerif = { jti: `${token.id}`, sub: '', type }
      let exception: Exception

      // Act
      try {
        await Subject.findOwnerByPayload(payload)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.UNPROCESSABLE_ENTITY)
      expect(exception!.data.payload).to.deep.equal(payload)
      expect(exception!.message).to.equal('Token malformed')
    })

    it('should throw if token is not found', async function (this) {
      // Arrange
      const jti: JwtPayloadVerif['jti'] = `${this.faker.datatype.number(-2)}`
      const sub: JwtPayloadVerif['sub'] = users[tokens[0].user].email
      let exception: Exception

      // Act
      try {
        await Subject.findOwnerByPayload({ jti, sub, type })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })

    it('should throw if token owners do not match', async () => {
      // Arrange
      const { id, user } = tokens.find(t => t.type === type)!
      const token_other = tokens.find(t => t.type === type && t.user !== user)
      const jti: JwtPayloadVerif['jti'] = `${id}`
      const sub: JwtPayloadVerif['sub'] = users[token_other!.user - 1].email
      const payload: JwtPayloadVerif = { jti, sub, type }
      let exception: Exception

      // Act
      try {
        await Subject.findOwnerByPayload(payload)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.UNAUTHORIZED)
      expect(exception!.data.payload).to.deep.equal(payload)
      expect(exception!.data.token).to.be.an('object')
      expect(exception!.data.user.id).to.be.a('number')
      expect(exception!.message).to.equal('Token owner mismatch')
    })
  })
})
