import FIND_OPTIONS_SEEDED_USERS from '@fixtures/find-options-seeded-users'
import MAGIC_NUMBER from '@fixtures/magic-number.fixture'
import { ExceptionCode } from '@flex-development/exceptions/enums'
import { isExceptionJSON } from '@flex-development/exceptions/guards'
import { CacheModule, HttpStatus } from '@nestjs/common'
import type { ModuleRef } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { PaginatedDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import {
  ErrorFilter,
  ExceptionClassFilter,
  HttpExceptionFilter
} from '@sneusers/filters'
import type { QueryParams } from '@sneusers/models'
import { SequelizeError } from '@sneusers/modules/db/enums'
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
import { PatchUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'
import createAccessToken from '@tests/utils/create-access-token.util'
import createApp from '@tests/utils/create-app.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { AuthedUser } from '@tests/utils/types'
import TestSubject from '../users.controller'

/**
 * @file E2E Tests - UsersController
 * @module sneusers/subdomains/users/controllers/tests/e2e/UsersController
 */

describe('e2e:subdomains/users/controllers/UsersController', () => {
  const URL = stubURLPath('users')

  let app: NestExpressApplication
  let repo: typeof User
  let req: ChaiHttp.Agent
  let seeds: User[]
  let user_1: AuthedUser
  let user_2: AuthedUser
  let user_3: AuthedUser

  before(async () => {
    app = await createApp({
      controllers: [TestSubject],
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        JwtModule.registerAsync(JwtConfigService.moduleOptions),
        SequelizeModule.forFeature([Token, User])
      ],
      async onModuleInit(ref: ModuleRef): Promise<void> {
        const auth = ref.get(AuthService, { strict: false })

        repo = ref.get(UsersService, { strict: false }).repository

        seeds = await repo.findAll(FIND_OPTIONS_SEEDED_USERS)
        user_1 = await createAccessToken(auth, seeds[1])
        user_2 = await createAccessToken(auth, seeds[2])
        user_3 = await createAccessToken(auth, seeds[3])
      },
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

    req = chai.request.agent(app.getHttpServer())
  })

  after(async () => {
    await app.close()
  })

  describe('/users', () => {
    describe('GET', () => {
      it('should send PaginatedDTO<UserDTO>', async () => {
        // Arrange
        const query: QueryParams<User> = {
          attributes: 'email',
          group: 'email,id',
          limit: MAGIC_NUMBER,
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
        // Act
        const res = await req
          .delete([URL, user_1.email].join('/'))
          .set('Authorization', `Bearer ${user_1.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK)
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.a('string')
        expect(res.body.email).to.equal(user_1.email.toLowerCase())
        expect(res.body.email_verified).to.be.false
        expect(res.body.first_name).to.equal(user_1.first_name.toLowerCase())
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.be.a('number')
        expect(res.body.last_name).to.equal(user_1.last_name.toLowerCase())
        expect(res.body.password).to.be.undefined
        expect(res.body.provider).to.be.null
        expect(res.body.updated_at).to.be.null
      })

      it('should send error if access token is invalid', async () => {
        // Act
        const res = await req
          .delete([URL, user_1.email].join('/'))
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
          .set('Authorization', `Bearer ${user_2.access_token}`)

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
        const seed: User = seeds[4]

        // Act
        const res = await req.get([URL, seed.email].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.equal(seed.created_at)
        expect(res.body.display_name).to.equal(seed.display_name)
        expect(res.body.email).to.equal(seed.email)
        expect(res.body.email_verified).to.be.undefined
        expect(res.body.first_name).to.equal(seed.first_name)
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.equal(seed.id)
        expect(res.body.last_name).to.equal(seed.last_name)
        expect(res.body.password).to.be.undefined
        expect(res.body.provider).to.be.undefined
        expect(res.body.updated_at).to.equal(seed.updated_at)
      })

      it('should send UserDTO given id of existing user', async () => {
        // Arrange
        const seed: User = seeds[4]

        // Act
        const res = await req.get([URL, seed.id].join('/'))

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.equal(seed.created_at)
        expect(res.body.display_name).to.equal(seed.display_name)
        expect(res.body.email).to.equal(seed.email)
        expect(res.body.email_verified).to.be.undefined
        expect(res.body.first_name).to.equal(seed.first_name)
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.equal(seed.id)
        expect(res.body.last_name).to.equal(seed.last_name)
        expect(res.body.password).to.be.undefined
        expect(res.body.provider).to.be.undefined
        expect(res.body.updated_at).to.equal(seed.updated_at)
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
        const dto = new PatchUserDTO<'internal'>({ email_verified: true })

        await repo.update(dto, {
          fields: ['email_verified'],
          silent: true,
          where: { id: user_2.id }
        })
      })

      it('should send back updated user', async function (this) {
        // Arrange
        const email: User['email'] = this.faker.internet.exampleEmail()
        const dto = new PatchUserDTO({ email })

        // Act
        const res = await req
          .patch([URL, user_2.id].join('/'))
          .send(dto)
          .set('Authorization', `Bearer ${user_2.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        expect(res.body).not.to.be.instanceOf(User)
        expect(res.body.created_at).to.be.a('number')
        expect(res.body.display_name).to.be.a('string')
        expect(res.body.email).to.equal(dto.email!.toLowerCase())
        expect(res.body.email_verified).to.be.true
        expect(res.body.first_name).to.be.a('string')
        expect(res.body.full_name).to.be.a('string')
        expect(res.body.id).to.equal(user_2.id)
        expect(res.body.last_name).to.be.a('string')
        expect(res.body.password).to.be.undefined
        expect(res.body.provider).to.be.null
        expect(res.body.updated_at).to.be.a('number')
      })

      it('should send error if access token is invalid', async function (this) {
        // Arrange
        const dto = new PatchUserDTO({ last_name: this.faker.name.lastName() })

        // Act
        const res = await req
          .patch([URL, user_2.id].join('/'))
          .send(dto)
          .set('Authorization', `Bearer ${this.faker.datatype.uuid()}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
      })

      it('should send error if email is not verified', async function (this) {
        // Arrange
        const password = this.faker.internet.password(MAGIC_NUMBER)
        const dto = new PatchUserDTO({ password })

        // Act
        const res = await req
          .patch([URL, user_3.id].join('/'))
          .send(dto)
          .set('Authorization', `Bearer ${user_3.access_token}`)

        // Expect
        expect(res).to.be.jsonResponse(ExceptionCode.UNAUTHORIZED, 'object')
        expect(res.body).not.to.be.instanceOf(Exception)
        expect(isExceptionJSON(res.body)).to.be.true
        expect(res.body.errors[0]).to.be.an('object')
        expect(res.body.errors[0].email).to.equal(user_3.email)
        expect(res.body.data.user).to.be.an('object')
        expect(res.body.data.user.id).to.equal(user_3.id)
        expect(res.body.message).to.equal('Email not verified')
      })
    })
  })
})
