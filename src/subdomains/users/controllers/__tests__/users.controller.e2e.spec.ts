import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import type {
  CreateUserDTO,
  PatchUserDTO
} from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import createApp from '@tests/utils/create-app.util'
import createUserDTO from '@tests/utils/create-user-dto.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { SuperTest, Test } from 'supertest'
import request from 'supertest'
import TestSubject from '../users.controller'

/**
 * @file E2E Tests - UsersController
 * @module sneusers/subdomains/users/controllers/tests/e2e/UsersController
 */

describe('e2e:subdomains/users/controllers/UsersController', () => {
  const URL = stubURLPath('users')
  const USERS: CreateUserDTO[] = createUsers(13)

  let app: INestApplication
  let queryInterface: QueryInterface
  let req: SuperTest<Test>
  let users: UsersService

  before(async () => {
    const napp = await createApp({
      controllers: [TestSubject],
      imports: [SequelizeModule.forFeature([User])],
      providers: [UsersService]
    })

    app = await napp.app.init()
    req = request(napp.app.getHttpServer())
    users = napp.ref.get(UsersService)
    queryInterface = napp.ref.get(Sequelize).getQueryInterface()

    await seedTable<User>(users.repo, USERS)
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('/users', () => {
    describe('POST', () => {
      it('should send UserDTO if new user was created', async () => {
        // Arrange
        const dto: CreateUserDTO = { ...createUserDTO(), password: 'password' }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.CREATED, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.email).to.equal(dto.email)
        expect(res.body.first_name).to.equal(dto.first_name)
        expect(res.body.password).to.be.undefined
        expect(res.body.last_name).to.equal(dto.last_name)
      })

      it('should send error if user email is not unique', async () => {
        // Arrange
        const dto: CreateUserDTO = { ...createUserDTO(), email: USERS[0].email }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.CONFLICT, 'object')
        expect(res.body).not.to.be.instanceOf(UniqueEmailException)
        expect(res.body.data.error).to.equal(SequelizeError.UniqueConstraint)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(/already exists/)
      })
    })

    describe('GET', () => {
      it('should send search results array', async () => {
        // Arrange
        const query = new QueryParams<IUser>({
          attributes: 'email',
          group: 'email,id',
          limit: Math.floor(USERS.length / 2),
          order: 'id,ASC|last_name,DESC'
        })

        // Act
        const res = await req.get(stubURLPath(URL, query))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'array')
        expect(res.body).each((user, index) => {
          user.not.to.be.instanceOf(User)
          expect(res.body[index].password).to.be.undefined
        })
      })
    })
  })

  describe('/users/{uid}', () => {
    describe('DELETE', () => {
      it('should send UserDTO if user was deleted', async () => {
        // Arrange
        const user = USERS[USERS.length - 1]

        // Act
        const res = await req.delete(`${URL}/${user.email}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.equal(user.email)
        expect(res.body.first_name).to.equal(user.first_name)
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.equal(user.last_name)
        expect(res.body.name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const uid = this.faker.internet.email()

        // Act
        const res = await req.delete([URL, uid].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(uid))
      })
    })

    describe('GET', () => {
      it('should send UserDTO given email of existing user', async () => {
        // Arrange
        const email: User['email'] = USERS[0].email

        // Act
        const res = await req.get([URL, email].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.equal(email)
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send UserDTO given id of existing user', async () => {
        // Arrange
        const id: User['id'] = 1

        // Act
        const res = await req.get([URL, id].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.be.a('string')
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.id).to.equal(id)
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const uid = this.faker.datatype.number() * 420

        // Act
        const res = await req.get(`${URL}/${uid}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(uid.toString()))
      })
    })

    describe('PATCH', () => {
      it('should send UserDTO if user was updated', async function (this) {
        // Arrange
        const uid = USERS[1].email
        const dto: PatchUserDTO = { email: this.faker.internet.exampleEmail() }

        // Act
        const res = await req.patch([URL, uid].join('/')).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.equal(dto.email)
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.a('number')
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const uid = 'foofoobaby@email.com'
        const dto: PatchUserDTO = { first_name: this.faker.name.firstName() }

        // Act
        const res = await req.patch([URL, uid].join('/')).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(uid))
      })
    })
  })
})
