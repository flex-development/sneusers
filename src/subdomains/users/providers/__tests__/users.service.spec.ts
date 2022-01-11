import type { INestApplication } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type {
  CreateUserDTO,
  PatchUserDTO
} from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import createApp from '@tests/utils/create-app.util'
import createUserDTO from '@tests/utils/create-user-dto.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import pick from 'lodash.pick'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../users.service'

/**
 * @file Unit Tests - UsersService
 * @module sneusers/users/providers/tests/unit/UsersService
 */

describe('unit:subdomains/users/providers/UsersService', () => {
  const USERS: CreateUserDTO[] = createUsers(13)

  let app: INestApplication
  let queryInterface: QueryInterface
  let subject: TestSubject

  before(async () => {
    const napp = await createApp({
      imports: [SequelizeModule.forFeature([User])],
      providers: [TestSubject]
    })

    app = await napp.app.init()
    subject = napp.ref.get(TestSubject)
    queryInterface = napp.ref.get(Sequelize).getQueryInterface()

    await seedTable<User>(subject.repo, USERS)
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('#create', () => {
    it('should return typeof User if user was created', async () => {
      // Arrange
      const dto: CreateUserDTO = pick(createUserDTO(), [
        'email',
        'first_name',
        'last_name'
      ])

      // Act
      const result = await subject.create(dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.email).to.equal(dto.email.toLowerCase())
      expect(result.first_name).to.equal(dto.first_name.toLowerCase())
      expect(result.last_name).to.equal(dto.last_name.toLowerCase())
    })

    it('should throw if dto.email is not unique', async () => {
      // Arrange
      const dto: CreateUserDTO = USERS[2]
      let exception: Exception

      // Act
      try {
        await subject.create(dto)
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(UniqueEmailException)
      expect(exception!.code).to.equal(ExceptionCode.CONFLICT)
      expect(exception!.data.error).to.equal(SequelizeError.UniqueConstraint)
      expect(exception!.errors).to.be.an('array')
      expect(exception!.message).to.match(/already exists/)
    })
  })

  describe('#find', () => {
    it('should return array of users', async () => {
      // Act
      const result = await subject.find()

      // Expect
      expect(result).to.be.an('array')
      expect(result).each(user => user.to.be.instanceOf(User))
    })
  })

  describe('#findOne', () => {
    it('should return typeof User given uid of existing user', async () => {
      expect(await subject.findOne(USERS[0].email)).to.be.instanceOf(User)
    })

    it('should return null if user is not found', async function (this) {
      expect(await subject.findOne(this.faker.name.firstName())).to.be.null
    })
  })

  describe('#patch', () => {
    it('should return typeof User if user was updated', async function (this) {
      // Arrange
      const uid = USERS[USERS.length - 1].email
      const dto: PatchUserDTO = { last_name: this.faker.name.lastName() }

      // Act
      const result = await subject.patch(uid, dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.email).to.equal(uid.toLowerCase())
      expect(result.first_name).to.be.a('string')
      expect(result.last_name).to.equal(dto.last_name!.toLowerCase())
      expect(result.updated_at).to.not.be.null
    })

    it('should throw if dto.email is not unique', async () => {
      // Arrange
      const email = (await subject.repo.findByUid(USERS[0].email))!.email
      let exception: Exception

      // Act
      try {
        await subject.patch(USERS[USERS.length - 2].email, { email })
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(UniqueEmailException)
      expect(exception!.code).to.equal(ExceptionCode.CONFLICT)
      expect(exception!.message).to.match(/already exists/)
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      let exception: Exception

      // Act
      try {
        await subject.patch(this.faker.internet.exampleEmail())
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })

  describe('#remove', () => {
    it('should return typeof User if user was deleted', async () => {
      expect(await subject.remove(USERS[3].email)).to.be.instanceOf(User)
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      let exception: Exception

      // Act
      try {
        await subject.remove(this.faker.datatype.number() * -1)
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })
})
