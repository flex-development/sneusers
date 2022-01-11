import type { NullishString } from '@flex-development/tutils'
import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type { LoginRequestDTO } from '@sneusers/subdomains/auth/dtos'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import { LocalStrategy } from '@sneusers/subdomains/auth/strategies'
import type { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import UsersModule from '@sneusers/subdomains/users/users.module'
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
import TestSubject from '../auth.controller'

/**
 * @file E2E Tests - AuthController
 * @module sneusers/subdomains/auth/controllers/tests/e2e/AuthController
 */

describe('e2e:subdomains/auth/controllers/AuthController', () => {
  const USER: CreateUserDTO = { ...createUserDTO(), password: 'password' }

  let app: INestApplication
  let auth: AuthService
  let queryInterface: QueryInterface
  let req: SuperTest<Test>
  let table: CreateUserDTO[]

  before(async () => {
    const napp = await createApp({
      controllers: [TestSubject],
      imports: [UsersModule, PassportModule],
      providers: [AuthService, LocalStrategy]
    })

    app = await napp.app.init()
    auth = napp.ref.get(AuthService)
    queryInterface = napp.ref.get(Sequelize).getQueryInterface()
    req = request(napp.app.getHttpServer())

    // @ts-expect-error Property 'users' is protected
    table = await seedTable<User>(auth.users.repo, [...createUsers(13), USER])
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('/auth/login', () => {
    const URL = stubURLPath('auth/login')

    describe('POST', () => {
      it('should send UserDTO if existing user was logged in', async () => {
        // Arrange
        const dto: LoginRequestDTO = {
          email: USER.email,
          password: USER.password as NullishString
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.equal(dto.email.toLowerCase())
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const dto: LoginRequestDTO = {
          email: this.faker.internet.email(),
          password: this.faker.internet.password()
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(dto.email))
      })

      it('should send error if login credentials are invalid', async () => {
        // Arrange
        const dto: LoginRequestDTO = {
          email: USER.email,
          password: 'foofoobaby'
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(res.body.data.user).to.be.an('object')
        expect(res.body.data.user.email).to.equal(dto.email.toLowerCase())
        expect(res.body.data.user.id).to.be.a('number')
        expect(res.body.data.user.password).to.equal(dto.password)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('Invalid credentials')
      })
    })
  })

  describe('/auth/register', () => {
    const URL = stubURLPath('auth/register')

    describe('POST', () => {
      it('should send UserDTO if new user was registered', async () => {
        // Arrange
        const dto: CreateUserDTO = {
          ...createUserDTO(),
          password: USER.password
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.CREATED, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.email).to.equal(dto.email.toLowerCase())
        expect(res.body.first_name).to.equal(dto.first_name.toLowerCase())
        expect(res.body.last_name).to.equal(dto.last_name.toLowerCase())
        expect(res.body.password).to.be.undefined
      })

      it('should send error if user email is not unique', async () => {
        // Arrange
        const dto: CreateUserDTO = { ...createUserDTO(), email: table[0].email }

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
  })
})
