import { isExceptionJSON } from '@flex-development/exceptions/guards'
import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import {
  ErrorFilter,
  ExceptionClassFilter,
  HttpExceptionFilter
} from '@sneusers/filters'
import { CookieParserMiddleware, CsurfMiddleware } from '@sneusers/middleware'
import { QueryParams } from '@sneusers/models'
import { RefreshToken } from '@sneusers/subdomains/auth/entities'
import {
  AuthService,
  JwtConfigService,
  RefreshTokensService,
  TokensService
} from '@sneusers/subdomains/auth/providers'
import { JwtStrategy } from '@sneusers/subdomains/auth/strategies'
import type {
  CreateUserDTO,
  PatchUserDTO
} from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import CsrfTokenController from '@tests/fixtures/csrf-token-controller.fixture'
import createApp from '@tests/utils/create-app.util'
import createAuthedUser from '@tests/utils/create-authed-user.util'
import createUsers from '@tests/utils/create-users.util'
import getCsrfToken from '@tests/utils/get-csrf-token.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { MockAuthedUser, MockCsrfToken } from '@tests/utils/types'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../users.controller'

/**
 * @file E2E Tests - UsersController
 * @module sneusers/subdomains/users/controllers/tests/e2e/UsersController
 */

describe('e2e:subdomains/users/controllers/UsersController', () => {
  const URL = stubURLPath('users')
  const USERS = createUsers(13)

  let app: INestApplication
  let auth: AuthService
  let csrf: MockCsrfToken
  let queryInterface: QueryInterface
  let req: ChaiHttp.Agent
  let table: CreateUserDTO[]
  let users: UsersService
  let user_authed_1: MockAuthedUser
  let user_authed_2: MockAuthedUser

  before(async () => {
    const ntapp = await createApp({
      controllers: [CsrfTokenController, TestSubject],
      imports: [
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        SequelizeModule.forFeature([RefreshToken, User])
      ],
      providers: [
        AuthService,
        ErrorFilter.PROVIDER,
        ExceptionClassFilter.PROVIDER,
        HttpExceptionFilter.PROVIDER,
        JwtConfigService,
        JwtStrategy,
        RefreshTokensService,
        TokensService,
        UsersService
      ]
    })

    CsurfMiddleware.configure({ ignoreRoutes: ['/csrf-token'] })

    ntapp.app.use(new CookieParserMiddleware().use)
    ntapp.app.use(new CsurfMiddleware().use)

    app = await ntapp.app.init()
    auth = ntapp.ref.get(AuthService)
    queryInterface = ntapp.ref.get(Sequelize).getQueryInterface()
    req = chai.request.agent(app.getHttpServer())
    users = ntapp.ref.get(UsersService)
    user_authed_1 = await createAuthedUser(auth, USERS.length + 1)
    user_authed_2 = await createAuthedUser(auth, user_authed_1.id + 1)

    USERS.push(user_authed_1, user_authed_2)

    table = await seedTable<User>(users.repository, USERS, {
      fields: ['email', 'first_name', 'last_name']
    })

    csrf = await getCsrfToken(req)
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('/users', () => {
    describe('GET', () => {
      it('should send search results array', async () => {
        // Arrange
        const query = new QueryParams<IUser>({
          attributes: 'email',
          group: 'email,id',
          limit: Math.floor(table.length / 2),
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
        const user = Object.assign({}, user_authed_1)

        // Act
        const res = await req
          .delete([URL, user.email].join('/'))
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.equal(user.email.toLowerCase())
        expect(res.body.first_name).to.equal(user.first_name.toLowerCase())
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.equal(user.last_name.toLowerCase())
        expect(res.body.name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if csrf token is invalid', async () => {
        // Act
        const res = await req
          .delete([URL, user_authed_1.email].join('/'))
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('x-csrf-token', 'x-csrf-token')
          .set('Authorization', `Bearer ${user_authed_1.access_token}`)

        expect(res).to.be.jsonResponse(ExceptionCode.FORBIDDEN, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if access token is invalid', async () => {
        // Act
        const res = await req
          .delete([URL, user_authed_1.email].join('/'))
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('x-csrf-token', csrf.csrf_token)
          .set('Authorization', 'Bearer user_access_token')

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('Unauthorized')
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const uid = this.faker.internet.email()

        // Act
        const res = await req
          .delete([URL, uid].join('/'))
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('xsrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user_authed_2.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(uid))
      })
    })

    describe('GET', () => {
      it('should send UserDTO given email of existing user', async () => {
        // Arrange
        const email: User['email'] = table[0].email

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
        const res = await req.get([URL, uid].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(uid.toString()))
      })
    })

    describe('PATCH', () => {
      it('should send UserDTO if user was updated', async function (this) {
        // Arrange
        const dto: PatchUserDTO = { email: this.faker.internet.exampleEmail() }

        // Act
        const res = await req
          .patch([URL, user_authed_2.id].join('/'))
          .send(dto)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('x-xsrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user_authed_2.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.equal(dto.email!.toLowerCase())
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.a('number')
      })

      it('should send error if csrf token is invalid', async function (this) {
        // Act
        const res = await req
          .patch([URL, user_authed_2.id].join('/'))
          .send({ first_name: this.faker.name.firstName() } as PatchUserDTO)
          .set('Cookie', '_csrf=_csrf')
          .set('csrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user_authed_2.access_token}`)

        expect(res).to.be.jsonResponse(ExceptionCode.FORBIDDEN, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if access token is invalid', async function (this) {
        // Act
        const res = await req
          .patch([URL, user_authed_2.id].join('/'))
          .send({ last_name: this.faker.name.lastName() } as PatchUserDTO)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${this.faker.datatype.uuid()}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('Unauthorized')
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const uid = 'foofoobaby@email.com'

        // Act
        const res = await req
          .patch([URL, uid].join('/'))
          .send({ password: this.faker.internet.password(13) } as PatchUserDTO)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('x-csrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user_authed_2.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(uid))
      })
    })
  })
})
