import { ExceptionCode } from '@flex-development/exceptions/enums'
import { isExceptionJSON } from '@flex-development/exceptions/guards'
import type { NullishString } from '@flex-development/tutils'
import { CacheModule, HttpStatus } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DatabaseTable,
  SequelizeErrorName as SequelizeError
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import {
  ErrorFilter,
  ExceptionClassFilter,
  HttpExceptionFilter
} from '@sneusers/filters'
import { CookieParserMiddleware, CsurfMiddleware } from '@sneusers/middleware'
import {
  CookieConfigService,
  CsurfConfigService
} from '@sneusers/modules/middleware/providers'
import { CacheConfigService } from '@sneusers/providers'
import type {
  RegisterUserDTO,
  RequestLoginDTO
} from '@sneusers/subdomains/auth/dtos'
import { LoginDTO } from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import {
  AuthService,
  JwtConfigService,
  Strategist,
  TokensService,
  VerificationService
} from '@sneusers/subdomains/auth/providers'
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy
} from '@sneusers/subdomains/auth/strategies'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import { UsersService } from '@sneusers/subdomains/users/providers'
import UsersModule from '@sneusers/subdomains/users/users.module'
import CsrfTokenController from '@tests/fixtures/csrf-token-controller.fixture'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createAuthedUser from '@tests/utils/create-authed-user.util'
import createUsers from '@tests/utils/create-users.util'
import getCreateUserDTO from '@tests/utils/get-create-user-dto.util'
import getCsrfToken from '@tests/utils/get-csrf-token.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type {
  AuthedUser,
  MockCreateUserDTO,
  MockCsrfToken
} from '@tests/utils/types'
import cookie from 'cookie'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../auth.controller'

/**
 * @file E2E Tests - AuthController
 * @module sneusers/subdomains/auth/controllers/tests/e2e/AuthController
 */

describe('e2e:subdomains/auth/controllers/AuthController', () => {
  const USERS = createUsers(MAGIC_NUMBER)

  let app: NestExpressApplication
  let auth: AuthService
  let csrf: MockCsrfToken
  let qi: QueryInterface
  let req: ChaiHttp.Agent
  let table: CreateUserDTO[]
  let user_authed: AuthedUser

  before(async () => {
    const ntapp = await createApp({
      controllers: [CsrfTokenController, TestSubject],
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        PassportModule,
        SequelizeModule.forFeature([Token]),
        UsersModule
      ],
      middlewares: [CookieParserMiddleware, CsurfMiddleware],
      providers: [
        AuthService,
        CookieConfigService.createProvider(),
        CsurfConfigService.createProvider(),
        ErrorFilter.createProvider(),
        ExceptionClassFilter.createProvider(),
        HttpExceptionFilter.createProvider(),
        JwtRefreshStrategy,
        JwtStrategy,
        LocalStrategy,
        Strategist,
        TokensService,
        VerificationService
      ]
    })

    app = await ntapp.app.init()
    auth = ntapp.ref.get(AuthService)
    qi = ntapp.ref.get(Sequelize).getQueryInterface()
    req = chai.request.agent(app.getHttpServer())
    user_authed = await createAuthedUser(qi, auth, USERS.length + 1)

    table = await seedTable<User>(ntapp.ref.get(UsersService).repository, USERS)
    csrf = await getCsrfToken(req)
  })

  after(async () => {
    await resetSequence(qi, DatabaseTable.TOKENS)
    await resetSequence(qi, DatabaseTable.USERS)
    await app.close()
  })

  describe('/auth/login', () => {
    const URL = stubURLPath('auth/login')

    describe('POST', () => {
      it('should send access token and set refresh cookie', async () => {
        // Act
        const res = await req
          .post(URL)
          .send({ email: user_authed.email, password: user_authed.password })
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)
        const cookies = res.header['set-cookie'].join(';')

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(LoginDTO)
        expect(res.body.access_token).to.be.a('string')
        expect(cookie.parse(cookies).Refresh).not.to.be.empty
      })

      it('should send error if csrf token is invalid', async () => {
        // Arrange
        const dto: RequestLoginDTO = {
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
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const dto: RequestLoginDTO = {
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
        expect(res.body.message).to.match(new RegExp(dto.email))
      })

      it('should send error if login credentials are invalid', async () => {
        // Arrange
        const dto: RequestLoginDTO = {
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
        expect(res.body.data.user.email).to.be.a('string')
        expect(res.body.data.user.id).to.be.a('number')
        expect(res.body.data.user.password).to.equal(dto.password)
        expect(res.body.message).to.equal('Invalid login credentials')
      })
    })
  })

  describe('/auth/logout', () => {
    const URL = stubURLPath('auth/logout')

    describe('POST', () => {
      it('should send logged out user and set refresh cookie', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Authorization', `Bearer ${user_authed.access_token}`)
        const cookies = res.header['set-cookie'].join(';')

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.be.a('string')
        expect(res.body.email_verified).to.be.false
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
        expect(cookie.parse(cookies).Refresh).to.be.empty
      })

      it('should send error if access token is invalid', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Authorization', 'Bearer access_token')

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
      })
    })
  })

  describe('/auth/refresh', () => {
    const URL = stubURLPath('auth/refresh')

    describe('POST', () => {
      it('should send new user access token', async () => {
        // Arrange
        const { header: login } = await req
          .post(stubURLPath('auth/login'))
          .send({ email: user_authed.email, password: user_authed.password })
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', csrf.csrf_token)
        const cookies = login['set-cookie'].join(';')
        const refresh_token = cookie.parse(cookies).Refresh

        // Act
        const res = await req
          .post(URL)
          .set('Cookie', `_csrf=${csrf._csrf}; Refresh=${refresh_token}`)
          .set('csrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(LoginDTO)
        expect(res.body.access_token).to.be.a('string')
      })

      it('should send error if csrf token is invalid', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Cookie', `_csrf=${csrf._csrf}`)
          .set('csrf-token', 'token-from-cookie')

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.FORBIDDEN, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.message).to.equal('invalid csrf token')
      })

      it('should send error if refresh token is invalid', async () => {
        // Act
        const res = await req
          .post(URL)
          .set('Cookie', `_csrf=${csrf._csrf}; Refresh=`)
          .set('x-xsrf-token', csrf.csrf_token)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.message).to.equal('Unauthorized')
      })
    })
  })

  describe('/auth/register', () => {
    const URL = stubURLPath('auth/register')

    describe('POST', () => {
      it('should send UserDTO and set csrf-token cookie', async () => {
        // Arrange
        const dto: RegisterUserDTO & MockCreateUserDTO = {
          ...getCreateUserDTO(),
          password: user_authed.password
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.CREATED, 'object')
        expect(res).to.have.header('set-cookie', /csrf-token/)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.equal(dto.email.toLowerCase())
        expect(res.body.email_verified).to.be.undefined
        expect(res.body.first_name).to.equal(dto.first_name.toLowerCase())
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.equal(dto.last_name.toLowerCase())
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if user email is not unique', async () => {
        // Arrange
        const dto: RegisterUserDTO & MockCreateUserDTO = {
          ...getCreateUserDTO(),
          email: table[0].email,
          password: user_authed.password
        }

        // Act
        const res = await req.post(URL).send(dto)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.CONFLICT, 'object')
        expect(res.body).not.to.be.instanceOf(UniqueEmailException)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.UniqueConstraint)
        expect(res.body.message).to.match(/already exists/)
      })
    })
  })

  describe('/auth/whoami', () => {
    const URL = stubURLPath('auth/whoami')

    describe('GET', () => {
      it('should send current user and set csrf-token cookie', async () => {
        // Act
        const res = await req
          .get(URL)
          .set('Authorization', `Bearer ${user_authed.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res).to.have.header('set-cookie', /csrf-token/)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.be.a('string')
        expect(res.body.email_verified).to.be.false
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send anon response if user is not authenticated', async () => {
        // Act
        const res = await req.get(URL)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res).to.not.have.header('set-cookie', /csrf-token/)
        expect(res.body).to.be.empty
      })
    })
  })
})
