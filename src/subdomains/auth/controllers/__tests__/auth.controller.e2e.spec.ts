import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { AuthService } from '@sneusers/subdomains/auth/providers'
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
  const URL = stubURLPath('auth/register')

  let app: INestApplication
  let auth: AuthService
  let queryInterface: QueryInterface
  let req: SuperTest<Test>
  let table: CreateUserDTO[]

  before(async () => {
    const napp = await createApp({
      controllers: [TestSubject],
      imports: [UsersModule],
      providers: [AuthService]
    })

    app = await napp.app.init()
    auth = napp.ref.get(AuthService)
    queryInterface = napp.ref.get(Sequelize).getQueryInterface()
    req = request(napp.app.getHttpServer())

    // @ts-expect-error Property 'users' is protected
    table = await seedTable<User>(auth.users.repo, createUsers(13))
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('/auth/register', () => {
    describe('POST', () => {
      it('should send UserDTO if new user was registered', async () => {
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
