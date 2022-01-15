import { isExceptionJSON } from '@flex-development/exceptions/guards'
import type { NullishString } from '@flex-development/tutils'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { ErrorFilter } from '@sneusers/filters'
import { CookieParserMiddleware, CsurfMiddleware } from '@sneusers/middleware'
import AuthModule from '@sneusers/subdomains/auth/auth.module'
import type { LoginRequestDTO } from '@sneusers/subdomains/auth/dtos'
import { LoginDTO } from '@sneusers/subdomains/auth/dtos'
import { RefreshToken } from '@sneusers/subdomains/auth/entities'
import {
  AuthService,
  JwtConfigService,
  RefreshTokensService,
  TokensService
} from '@sneusers/subdomains/auth/providers'
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy
} from '@sneusers/subdomains/auth/strategies'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import UsersModule from '@sneusers/subdomains/users/users.module'
import CsrfTokenController from '@tests/fixtures/csrf-token-controller.fixture'
import createApp from '@tests/utils/create-app.util'
import createAuthedUser from '@tests/utils/create-authed-user.util'
import createUserDTO from '@tests/utils/create-user-dto.util'
import createUsers from '@tests/utils/create-users.util'
import getCsrfToken from '@tests/utils/get-csrf-token.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { MockAuthedUser, MockCsrfToken } from '@tests/utils/types'
import cookie from 'cookie'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../auth.controller'

/**
 * @file E2E Tests - AuthController
 * @module sneusers/subdomains/auth/controllers/tests/e2e/AuthController
 */

describe('e2e:subdomains/auth/controllers/AuthController', () => {
  const USERS = createUsers(13)

  let app: INestApplication
  let auth: AuthService
  let csrf: MockCsrfToken
  let queryInterface: QueryInterface
  let req: ChaiHttp.Agent
  let table: CreateUserDTO[]
  let user_authed: MockAuthedUser

  before(async () => {
    const ntapp = await createApp({
      controllers: [CsrfTokenController, TestSubject],
      imports: [
        JwtModule.registerAsync(AuthModule.JWT_MODULE_OPTIONS),
        PassportModule,
        SequelizeModule.forFeature([RefreshToken]),
        UsersModule
      ],
      providers: [
        { provide: APP_FILTER, useClass: ErrorFilter },
        AuthService,
        JwtConfigService,
        JwtStrategy,
        JwtRefreshStrategy,
        LocalStrategy,
        RefreshTokensService,
        TokensService
      ]
    })

    CsurfMiddleware.configure({
      ignoreMethods: ['HEAD', 'OPTIONS'],
      ignoreRoutes: ['/auth/register', '/csrf-token']
    })

    ntapp.app.use(new CookieParserMiddleware().use)
    ntapp.app.use(new CsurfMiddleware().use)

    app = await ntapp.app.init()
    auth = ntapp.ref.get(AuthService)
    queryInterface = ntapp.ref.get(Sequelize).getQueryInterface()
    req = chai.request.agent(app.getHttpServer())
    user_authed = await createAuthedUser(auth, USERS.length + 1)
    user_authed.password = 'password'

    USERS.push(user_authed)

    table = await seedTable<User>(auth._users.repository, USERS, {
      fields: ['email', 'first_name', 'last_name', 'password']
    })

    csrf = await getCsrfToken(req)
  })

  after(async () => {
    await resetSequence(queryInterface, DatabaseTable.USERS)
    await app.close()
  })

  describe('/auth/login', () => {
    const URL = stubURLPath('auth/login')

    describe('POST', () => {
      it('should send LoginDTO if user was logged in', async () => {
        // Act
        const res = await req
          .post(URL)
          .send({ email: user_authed.email, password: user_authed.password })
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res).to.have.header('set-cookie', /(^| )Refresh([^;]+)/)
        expect(res.body).not.to.be.instanceOf(LoginDTO)
        expect(res.body).to.have.keys(['access_token', 'id'])
        expect(res.body.access_token).to.be.a('string')
        expect(res.body.id).to.be.a('number')
      })

      it('should send error if csrf token is invalid', async () => {
        // Arrange
        const dto: LoginRequestDTO = {
          email: user_authed.email,
          password: user_authed.password as NullishString
        }

        // Act
        const res = await req
          .post(URL)
          .send(dto)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', user_authed.access_token)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.FORBIDDEN, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const dto: LoginRequestDTO = {
          email: this.faker.internet.email(),
          password: this.faker.internet.password()
        }

        // Act
        const res = await req
          .post(URL)
          .send(dto)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(new RegExp(dto.email))
      })

      it('should send error if login credentials are invalid', async () => {
        // Arrange
        const dto: LoginRequestDTO = {
          email: user_authed.email,
          password: 'foofoobaby'
        }

        // Act
        const res = await req
          .post(URL)
          .send(dto)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.credential).to.equal(dto.password)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('Invalid credentials')
      })
    })
  })

  describe('/auth/logout', () => {
    const URL = stubURLPath('auth/logout')

    describe('POST', () => {
      it('should set logout cookies if user was logged out', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('xsrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user_authed.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res).to.have.header('set-cookie', /(^| )Refresh([^;]+)/)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.email).to.be.a('string')
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if csrf token is invalid', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Cookie', '_csrf=secret')
          .set('csrf-token', csrf.csrf_token)
          .set('Authorization', `Bearer ${user_authed.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.FORBIDDEN, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if access token is invalid', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)
          .set('Authorization', 'Bearer access_token')

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('Unauthorized')
      })
    })
  })

  describe('/auth/refresh', () => {
    const URL = stubURLPath('auth/refresh')

    describe('GET', () => {
      it('should send new user access token', async () => {
        // Arrange
        const { header: login } = await req
          .post(stubURLPath('auth/login'))
          .send({ email: user_authed.email, password: user_authed.password })
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)
        const refresh_token = cookie.parse(login['set-cookie'][0]).Refresh

        // Act
        const res = await req
          .get(URL)
          .set('Cookie', `_csrf=${csrf._csrf}; Refresh=${refresh_token}`)
          .set('csrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(LoginDTO)
        expect(res.body).to.have.keys(['access_token', 'id'])
        expect(res.body.access_token).to.be.a('string')
        expect(res.body.id).to.be.a('number')
      })

      it('should send error if csrf token is invalid', async () => {
        // Act
        const res = await req
          .get(URL)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', 'token-from-cookie')

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.FORBIDDEN, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if refresh token is invalid', async () => {
        // Act
        const res = await req
          .get(URL)
          .set('Cookie', `_csrf=${csrf._csrf}; Refresh=`)
          .set('x-xsrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.equal('Unauthorized')
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
          password: user_authed.password
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.CREATED, 'object')
        expect(res).to.have.header('set-cookie', /csrf-token/)
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
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.UniqueConstraint)
        expect(res.body.errors).to.be.an('array')
        expect(res.body.message).to.match(/already exists/)
      })
    })
  })
})
