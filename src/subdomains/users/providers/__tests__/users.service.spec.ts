import { SequelizeModule } from '@nestjs/sequelize'
import { DatabaseTable, ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { CreateUserDTO, PatchUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import createApp from '@tests/utils/create-app.util'
import createUserDTO from '@tests/utils/create-user-dto.util'
import createUsers from '@tests/utils/create-users.util'
import pick from 'lodash.pick'
import type { QueryInterface } from 'sequelize'
import TestSubject from '../users.service'

/**
 * @file Unit Tests - UsersService
 * @module sneusers/users/providers/tests/unit/UsersService
 */

describe('unit:subdomains/users/providers/UsersService', () => {
  const USERS: CreateUserDTO[] = createUsers(13)
  const USER_ID_404: IUserRaw['id'] = USERS.length * 1000

  let Subject: TestSubject
  let queryInterface: QueryInterface

  before(async () => {
    const app = await createApp({
      imports: [SequelizeModule.forFeature([User])],
      providers: [TestSubject]
    })

    Subject = app.module_ref.get(TestSubject)
    Subject.repo.sequelize.addModels([User])
    queryInterface = Subject.repo.sequelize.getQueryInterface()

    for (const dto of USERS) await Subject.repo.create(dto, { silent: true })
  })

  after(async () => {
    await queryInterface.bulkDelete(DatabaseTable.SQLITE_SEQUENCE, {
      name: DatabaseTable.USERS
    })
  })

  describe('#create', () => {
    it('should return User instance if user was created', async () => {
      // Arrange
      const dto: CreateUserDTO = pick(createUserDTO(), [
        'email',
        'first_name',
        'last_name'
      ])

      // Act
      const result = await Subject.create(dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.email).to.equal(dto.email)
      expect(result.first_name).to.equal(dto.first_name)
      expect(result.last_name).to.equal(dto.last_name)
    })

    it('should throw if dto.email is not unique', async () => {
      // Arrange
      const dto: CreateUserDTO = USERS[2]
      let exception: Exception

      // Act
      try {
        await Subject.create(dto)
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(UniqueEmailException)
      expect(exception!.code).to.equal(ExceptionCode.CONFLICT)
      expect(exception!.message).to.match(/already exists/)
    })
  })

  describe('#find', () => {
    it('should return array of users', async () => {
      // Act
      const result = await Subject.find()

      // Expect
      expect(result).to.be.an('array')
      result.forEach(user => expect(user).to.be.instanceOf(User))
    })
  })

  describe('#findOne', () => {
    it('should return User instance given uid of existing user', async () => {
      expect(await Subject.findOne(USERS[0].email)).to.be.instanceOf(User)
    })

    it('should return null if user is not found', async () => {
      expect(await Subject.findOne(USER_ID_404)).to.be.null
    })
  })

  describe('#patch', () => {
    it('should return User instance if user was updated', async () => {
      // Arrange
      const uid = USERS[USERS.length - 1].email
      const dto: PatchUserDTO = {
        email: faker.internet.exampleEmail(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName()
      }

      // Act
      const result = await Subject.patch(uid, dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.email).to.equal(dto.email)
      expect(result.first_name).to.equal(dto.first_name)
      expect(result.last_name).to.equal(dto.last_name)
    })

    it('should throw if dto.email is not unique', async () => {
      // Arrange
      const email = (await Subject.repo.findByUid(USERS[0].email))!.email
      let exception: Exception

      // Act
      try {
        await Subject.patch(USERS[USERS.length - 2].email, { email })
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(UniqueEmailException)
      expect(exception!.code).to.equal(ExceptionCode.CONFLICT)
      expect(exception!.message).to.match(/already exists/)
    })

    it('should throw if user is not found', async () => {
      // Arrange
      let exception: Exception

      // Act
      try {
        await Subject.patch(USER_ID_404)
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })

  describe('#remove', () => {
    it('should return true if user was permanently deleted', async () => {
      expect(await Subject.remove(USERS[3].email)).to.be.true
    })

    it('should throw if user is not found', async () => {
      // Arrange
      let exception: Exception

      // Act
      try {
        await Subject.remove(USER_ID_404)
      } catch (error) {
        exception = error as Exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })
})
