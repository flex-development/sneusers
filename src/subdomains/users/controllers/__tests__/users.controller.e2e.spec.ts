import { ExceptionCode } from '@flex-development/exceptions/enums'
import { isExceptionJSON } from '@flex-development/exceptions/guards'
import { CacheModule, HttpStatus } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { PaginatedDTO } from '@sneusers/dtos'
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
import type { QueryParams } from '@sneusers/models'
import { CacheConfigService } from '@sneusers/providers'
import { Token } from '@sneusers/subdomains/auth/entities'
import {
  AuthService,
  JwtConfigService,
  Strategist,
  TokensService,
  VerificationService
} from '@sneusers/subdomains/auth/providers'
import { JwtStrategy } from '@sneusers/subdomains/auth/strategies'
import type { PatchUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'
import MAGIC_NUMBER from '@tests/fixtures/magic-number.fixture'
import createApp from '@tests/utils/create-app.util'
import createAuthedUser from '@tests/utils/create-authed-user.util'
import createUsers from '@tests/utils/create-users.util'
import resetSequence from '@tests/utils/reset-sequence.util'
import seedTable from '@tests/utils/seed-table.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { AuthedUser } from '@tests/utils/types'
import type { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../users.controller'

/**
 * @file E2E Tests - UsersController
 * @module sneusers/subdomains/users/controllers/tests/e2e/UsersController
 */

describe('e2e:subdomains/users/controllers/UsersController', () => {
  const URL = stubURLPath('users')
  const USERS = createUsers(MAGIC_NUMBER)

  let app: NestExpressApplication
  let auth: AuthService
  let qi: QueryInterface
  let req: ChaiHttp.Agent
  let table: User[]
  let users: UsersService
  let user_authed_1: AuthedUser
  let user_authed_2: AuthedUser
  let user_authed_3: AuthedUser

  before(async () => {
    const ntapp = await createApp({
      controllers: [TestSubject],
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        SequelizeModule.forFeature([Token, User])
      ],
      providers: [
        AuthService,
        ErrorFilter.createProvider(),
        ExceptionClassFilter.createProvider(),
        HttpExceptionFilter.createProvider(),
        JwtStrategy,
        Strategist,
        TokensService,
        UsersService,
        VerificationService
      ]
    })

    app = await ntapp.app.init()
    auth = ntapp.ref.get(AuthService)
    qi = ntapp.ref.get(Sequelize).getQueryInterface()
    req = chai.request.agent(app.getHttpServer())
    users = ntapp.ref.get(UsersService)
    user_authed_1 = await createAuthedUser(qi, auth, USERS.length + 1)
    user_authed_2 = await createAuthedUser(qi, auth, user_authed_1.id + 1)
    user_authed_3 = await createAuthedUser(qi, auth, user_authed_2.id + 1)

    table = await seedTable<User>(users.repository, USERS)
  })

  after(async () => {
    await resetSequence(qi, DatabaseTable.USERS)
    await app.close()
  })

  describe('/users', () => {
    describe('GET', () => {
      it('should send PaginatedDTO<UserDTO>', async () => {
        // Arrange
        const query: QueryParams<User> = {
          attributes: 'email',
          group: 'email,id',
          limit: Math.floor(table.length / 2),
          order: 'id,ASC|last_name,DESC'
        }

        // Act
        const res = await req.get(stubURLPath(URL, query))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(PaginatedDTO)
        expect(res.body.results).each((user, index) => {
          user.not.to.be.instanceOf(User)
          expect(res.body.results[index].password).to.be.undefined
        })
      })
    })
  })

  describe('/users/{uid}', () => {
    describe('DELETE', () => {
      it('should send back deleted user', async () => {
        // Arrange
        const user = Object.assign({}, user_authed_1)

        // Act
        const res = await req
          .delete([URL, user.email].join('/'))
          .set('Authorization', `Bearer ${user.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.equal(user.email.toLowerCase())
        expect(res.body.email_verified).to.be.false
        expect(res.body.first_name).to.equal(user.first_name.toLowerCase())
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.equal(user.last_name.toLowerCase())
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if access token is invalid', async () => {
        // Act
        const res = await req
          .delete([URL, user_authed_1.email].join('/'))
          .set('Authorization', 'Bearer user_access_token')

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
      })

      it('should send error if user is not found', async function (this) {
        // Arrange
        const uid = this.faker.internet.email()

        // Act
        const res = await req
          .delete([URL, uid].join('/'))
          .set('Authorization', `Bearer ${user_authed_2.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.NOT_FOUND, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.data.error).to.equal(SequelizeError.EmptyResult)
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
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.equal(email)
        expect(res.body.email_verified).to.be.undefined
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.null
      })

      it('should send UserDTO given id of existing user', async () => {
        // Arrange
        const id: User['id'] = table[0].id

        // Act
        const res = await req.get([URL, id].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.be.a('string')
        expect(res.body.email_verified).to.be.undefined
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.equal(id)
        expect(res.body.last_name).to.be.a('string')
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
        expect(res.body.message).to.match(new RegExp(uid.toString()))
      })
    })

    describe('PATCH', () => {
      before(async () => {
        const dto: PatchUserDTO<'internal'> = { email_verified: true }

        await users.repository.update(dto, {
          fields: ['email_verified'],
          silent: true,
          where: { id: user_authed_2.id }
        })
      })

      it('should send back updated user', async function (this) {
        // Arrange
        const dto: PatchUserDTO = {
          email: this.faker.internet.exampleEmail()
        }

        // Act
        const res = await req
          .patch([URL, user_authed_2.id].join('/'))
          .send(dto)
          .set('Authorization', `Bearer ${user_authed_2.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.null
        expect(res.body.email).to.equal(dto.email!.toLowerCase())
        expect(res.body.email_verified).to.be.true
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.updated_at).to.be.a('number')
      })

      it('should send error if access token is invalid', async function (this) {
        // Act
        const res = await req
          .patch([URL, user_authed_2.id].join('/'))
          .send({ last_name: this.faker.name.lastName() } as PatchUserDTO)
          .set('Authorization', `Bearer ${this.faker.datatype.uuid()}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
      })

      it('should send error if email is not verified', async function (this) {
        // Arrange
        const { access_token, email, id } = user_authed_3

        // Act
        const res = await req
          .patch([URL, id].join('/'))
          .send({
            password: this.faker.internet.password(MAGIC_NUMBER)
          } as PatchUserDTO)
          .set('Authorization', `Bearer ${access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors[0]).to.be.an('object')
        expect(res.body.errors[0].email).to.equal(email)
        expect(res.body.data.user).to.be.an('object')
        expect(res.body.data.user.id).to.equal(id)
        expect(res.body.message).to.equal('Email not verified')
      })
    })
  })
})
