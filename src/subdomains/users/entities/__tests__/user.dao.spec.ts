import { ExceptionCode } from '@flex-development/exceptions/enums'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { DatabaseTable, SequelizeErrorName } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { User } from '@sneusers/subdomains/users/entities'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import type { SequelizeError } from '@sneusers/types'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import type { Testcase } from '@tests/utils/types'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../user.dao'

/**
 * @file Unit Tests - User
 * @module sneusers/subdomains/users/entities/tests/unit/User
 */

describe('unit:subdomains/users/entities/User', () => {
  let Subject: typeof TestSubject
  let app: NestExpressApplication
  let queryInterface: QueryInterface
  let sequelize: Sequelize
  let users: TestSubject[]

  before(async () => {
    const ntapp = await createApp({
      imports: [SequelizeModule.forFeature([TestSubject])]
    })

    app = await ntapp.app.init()
    sequelize = ntapp.ref.get(Sequelize)
    queryInterface = sequelize.getQueryInterface()
    Subject = sequelize.models.User as typeof TestSubject
    Object.assign(Subject, { sequelize })

    users = await seedTable<TestSubject>(Subject, createUsers(MAGIC_NUMBER))
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('.checkPasswordStrength', () => {
    it('should return password if password is strong', () => {
      expect(Subject.checkPasswordStrength('password')).to.be.a('string')
    })

    it('should throw if password is not strong', async function (this) {
      // Arrange
      let error: Error

      // Act
      try {
        Subject.checkPasswordStrength(this.faker.lorem.word(4))
      } catch (e) {
        error = e as typeof error
      }

      expect(error!).to.be.instanceOf(Error)
      expect(error!.message).to.equal('Must be at least 8 characters')
    })
  })

  describe('.equal', () => {
    type Case = Testcase<boolean> & {
      state: string
      user1: Partial<Pick<IUser, 'email' | 'id'>>
      user2: Partial<Pick<IUser, 'email' | 'id'>>
    }

    const cases: Case[] = [
      {
        expected: false,
        state: 'user1.email !== user2.email && user1.id !== user2.id',
        user1: { email: 'email@email.com' },
        user2: { id: 3 }
      },
      {
        expected: true,
        state: 'user1.email === user2.email',
        user1: { email: 'email' },
        user2: { email: 'email' }
      },
      {
        expected: true,
        state: 'user1.id === user2.id',
        user1: { id: 0 },
        user2: { id: 0 }
      }
    ]

    cases.forEach(({ expected, state, user1, user2 }) => {
      it(`should return ${expected} if ${state}`, () => {
        expect(Subject.equal(user1, user2)).to.equal(expected)
      })
    })
  })

  describe('.findByEmail', () => {
    it('should return User given email of existing user', async () => {
      // Arrange
      const user = users[3]

      // Act
      const result = await Subject.findByEmail(user.email)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result!.created_at).to.equal(user.created_at)
      expect(result!.display_name).to.equal(user.display_name)
      expect(result!.email).to.equal(user.email)
      expect(result!.email_verified).to.equal(user.email_verified)
      expect(result!.first_name).to.equal(user.first_name)
      expect(result!.id).to.equal(user.id)
      expect(result!.last_name).to.equal(user.last_name)
      expect(result!.password).to.equal(user.password)
      expect(result!.provider).to.equal(user.provider)
      expect(result!.updated_at).to.equal(user.updated_at)
    })

    it('should return null if user is not found', async function (this) {
      // Arrange
      const email: User['email'] = this.faker.internet.exampleEmail()

      // Act + Expect
      expect(await Subject.findByEmail(email)).to.be.null
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      const email: User['email'] = this.faker.internet.exampleEmail()
      const emessage: string = `User with email [${email}] not found`
      let exception: Exception<SequelizeError>

      // Act
      try {
        await Subject.findByEmail(email, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.NOT_FOUND)
      expect(exception!.data.email).to.equal(email)
      expect(exception!.data.error).to.equal(SequelizeErrorName.EmptyResult)
      expect(exception!.data.options).to.be.an('object')
      expect(exception!.message).to.equal(emessage)
    })
  })

  describe('.findByPk', () => {
    it('should return User given id of existing user', async () => {
      // Arrange
      const user = users[4]

      // Act
      const result = await Subject.findByPk(user.id)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result!.created_at).to.equal(user.created_at)
      expect(result!.display_name).to.equal(user.display_name)
      expect(result!.email).to.equal(user.email)
      expect(result!.email_verified).to.equal(user.email_verified)
      expect(result!.first_name).to.equal(user.first_name)
      expect(result!.id).to.equal(user.id)
      expect(result!.last_name).to.equal(user.last_name)
      expect(result!.password).to.equal(user.password)
      expect(result!.provider).to.equal(user.provider)
      expect(result!.updated_at).to.equal(user.updated_at)
    })

    it('should return null if user is not found', async () => {
      expect(await Subject.findByPk(users.length * -420)).to.be.null
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      const pk: User['id'] = this.faker.datatype.number(-5)
      let exception: Exception<SequelizeError>

      // Act
      try {
        await Subject.findByPk(pk, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.NOT_FOUND)
      expect(exception!.data.error).to.equal(SequelizeErrorName.EmptyResult)
      expect(exception!.data.id).to.equal(pk)
      expect(exception!.data.options).to.be.an('object')
      expect(exception!.data.pk).to.not.be.undefined
      expect(exception!.message).to.equal(`User with id [${pk}] not found`)
    })
  })

  describe('.findByUid', () => {
    it('should return User given email of existing user', async () => {
      // Arrange
      const user = users[5]

      // Act
      const result = await Subject.findByUid(user.email)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result!.created_at).to.equal(user.created_at)
      expect(result!.display_name).to.equal(user.display_name)
      expect(result!.email).to.equal(user.email)
      expect(result!.email_verified).to.equal(user.email_verified)
      expect(result!.first_name).to.equal(user.first_name)
      expect(result!.id).to.equal(user.id)
      expect(result!.last_name).to.equal(user.last_name)
      expect(result!.password).to.equal(user.password)
      expect(result!.provider).to.equal(user.provider)
      expect(result!.updated_at).to.equal(user.updated_at)
    })

    it('should return User given id of existing user', async () => {
      // Arrange
      const user = users[5]

      // Act
      const result = await Subject.findByUid(user.id)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result!.created_at).to.equal(user.created_at)
      expect(result!.display_name).to.equal(user.display_name)
      expect(result!.email).to.equal(user.email)
      expect(result!.email_verified).to.equal(user.email_verified)
      expect(result!.first_name).to.equal(user.first_name)
      expect(result!.id).to.equal(user.id)
      expect(result!.last_name).to.equal(user.last_name)
      expect(result!.password).to.equal(user.password)
      expect(result!.provider).to.equal(user.provider)
      expect(result!.updated_at).to.equal(user.updated_at)
    })

    it('should return null given unknown email', async function (this) {
      // Arrange
      const uid: User['email'] = 'foofoobaby@email.com'

      // Act + Expect
      expect(await Subject.findByUid(uid)).to.be.null
    })

    it('should return null given unknown id', async function (this) {
      // Arrange
      const uid: User['id'] = this.faker.datatype.number() * -4200

      // Act + Expect
      expect(await Subject.findByUid(uid)).to.be.null
    })

    it('should throw given unknown email', async function (this) {
      // Arrange
      const uid: User['email'] = this.faker.internet.exampleEmail()
      let exception: Exception<SequelizeError>

      // Act
      try {
        await Subject.findByUid(uid, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.NOT_FOUND)
    })

    it('should throw given unknown id', async function (this) {
      // Arrange
      const uid: User['id'] = Date.now()
      let exception: Exception<SequelizeError>

      // Act
      try {
        await Subject.findByUid(uid, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.NOT_FOUND)
    })
  })
})
