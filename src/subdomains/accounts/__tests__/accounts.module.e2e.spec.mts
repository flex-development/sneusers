/**
 * @file E2E Tests - AccountsModule
 * @module sneusers/accounts/tests/e2e/AccountsModule
 */

import TestSubject from '#accounts/accounts.module'
import Account from '#accounts/entities/account.entity'
import CreateAccountHandler from '#accounts/handlers/create-account.handler'
import AccountsRepository from '#accounts/providers/accounts.repository'
import AuthService from '#accounts/services/auth.service'
import routes from '#enums/routes'
import subroutes from '#enums/subroutes'
import ACCOUNT_PASSWORD from '#fixtures/account-password'
import DependenciesModule from '#modules/dependencies.module'
import AccountFactory from '#tests/utils/account.factory'
import createApp from '#tests/utils/create-app'
import ERROR_PAYLOAD_KEYS from '#tests/utils/error-payload-keys'
import Seeder from '#tests/utils/seeder'
import stub500 from '#tests/utils/stub500'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import { ExceptionId } from '@flex-development/sneusers/errors'
import type {
  JsonObject,
  JsonPrimitive
} from '@flex-development/sneusers/types'
import { HttpStatus, type ModuleMetadata } from '@nestjs/common'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, type TestingModule } from '@nestjs/testing'
import type { InjectOptions, Response } from 'light-my-request'

describe('e2e:accounts/AccountsModule', () => {
  let app: NestFastifyApplication
  let metadata: ModuleMetadata
  let ref: TestingModule
  let repo: AccountsRepository
  let seeder: Seeder<AccountDocument>

  afterAll(async () => {
    await seeder.down()
    await app.close()
  })

  beforeAll(async () => {
    metadata = { imports: [DependenciesModule, TestSubject] }

    ref = await Test.createTestingModule(metadata).compile()

    repo = ref.get(AccountsRepository)
    app = await createApp(ref)

    seeder = new Seeder(new AccountFactory(), repo)
    await seeder.up()
  })

  describe('POST /accounts', () => {
    let headers: Required<InjectOptions>['headers']
    let method: Required<InjectOptions>['method']
    let url: string

    beforeAll(() => {
      headers = { 'content-type': 'application/json' }
      method = 'post'
      url = routes.ACCOUNTS
    })

    describe('201 (CREATED)', () => {
      let result: Response

      beforeAll(async () => {
        result = await app.inject({
          body: {
            email: faker.internet.email(),
            password: ACCOUNT_PASSWORD,
            type: AccountFactory.role
          },
          headers,
          method,
          url
        })
      })

      it('successful signup with email and password', () => {
        // Act
        const payload: JsonObject = result.json()

        // Expect
        expect(result).to.be.json.with.status(HttpStatus.CREATED)
        expect(payload).to.have.keys(['access_token', 'refresh_token', 'uid'])
        expect(payload['access_token']).to.be.a('string').and.not.empty
        expect(payload['access_token']).to.be.a('string').and.not.empty
        expect(payload['uid']).to.be.a('string').and.not.empty
      })
    })

    describe('400 (BAD_REQUEST)', () => {
      let code: HttpStatus
      let id: ExceptionId
      let reasonKeys: string[]

      beforeAll(() => {
        code = HttpStatus.BAD_REQUEST
        id = ExceptionId.VALIDATION_FAILURE
        reasonKeys = ['constraints', 'property', 'value']
      })

      it('failed signup with invalid account type', async () => {
        // Arrange
        const body: JsonObject = {
          email: faker.internet.email(),
          password: ACCOUNT_PASSWORD,
          type: AccountFactory.role + ',' + AccountFactory.role
        }

        // Act
        const result = await app.inject({ body, headers, method, url })
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(code)
        expect(payload).to.have.keys(ERROR_PAYLOAD_KEYS)
        expect(payload).to.have.property('code', code)
        expect(payload).to.have.property('id', id)
        expect(payload).to.have.property('message').be.a('string').and.not.empty
        expect(payload).to.have.property('reason').with.keys(reasonKeys)
        expect(payload).to.have.nested.property('reason.property', 'role')
        expect(payload).to.have.nested.property('reason.value', body['type'])
      })

      it('failed signup with invalid email', async () => {
        // Arrange
        const body: JsonObject = {
          email: 'bad-email',
          password: ACCOUNT_PASSWORD,
          type: AccountFactory.role
        }

        // Act
        const result = await app.inject({ body, headers, method, url })
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(code)
        expect(payload).to.have.keys(ERROR_PAYLOAD_KEYS)
        expect(payload).to.have.property('code', code)
        expect(payload).to.have.property('id', id)
        expect(payload).to.have.property('message').be.a('string').and.not.empty
        expect(payload).to.have.property('reason').with.keys(reasonKeys)
        expect(payload).to.have.nested.property('reason.property', 'email')
        expect(payload).to.have.nested.property('reason.value', body['email'])
      })

      it('failed signup with invalid password', async () => {
        // Arrange
        const body: JsonObject = {}
        const password: string = ''

        body['email'] = faker.internet.email()
        body['password'] = password
        body['type'] = AccountFactory.role

        // Act
        const result = await app.inject({ body, headers, method, url })
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(code)
        expect(payload).to.have.keys(ERROR_PAYLOAD_KEYS)
        expect(payload).to.have.property('code', code)
        expect(payload).to.have.property('id', id)
        expect(payload).to.have.property('message').be.a('string').and.not.empty
        expect(payload).to.have.property('reason').with.keys(reasonKeys)
        expect(payload).to.have.nested.property('reason.property', 'password')
        expect(payload).to.have.nested.property('reason.value', password)
      })
    })

    describe.todo('408 (REQUEST_TIMEOUT)')

    describe('409 (CONFLICT)', () => {
      let email: string

      beforeAll(async () => {
        email = seeder.seeds[0]!.email
      })

      it.each<JsonPrimitive>([
        faker.internet.password(),
        faker.internet.password({ length: 1 })
      ])('failed signup with conflicting email (%#)', async password => {
        // Arrange
        const body: JsonObject = {
          email,
          password,
          type: AccountFactory.role
        }

        // Act
        const result = await app.inject({ body, headers, method, url })
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(HttpStatus.CONFLICT)
        expect(payload).to.have.keys(ERROR_PAYLOAD_KEYS)
        expect(payload).to.have.property('code', HttpStatus.CONFLICT)
        expect(payload).to.have.property('id', ExceptionId.EMAIL_CONFLICT)
        expect(payload).to.have.property('message').be.a('string').and.not.empty
        expect(payload).to.have.nested.property('reason.email', body['email'])
      })
    })

    describe.todo('429 (TOO_MANY_REQUESTS)')

    describe('500 (INTERNAL_SERVER_ERROR)', () => {
      let app: NestFastifyApplication
      let result: Response

      afterAll(async () => {
        await app.close()
      })

      beforeAll(async () => {
        app = await createApp(
          await Test.createTestingModule(metadata)
            .overrideProvider(CreateAccountHandler)
            .useValue(stub500(url, 'execute'))
            .overrideProvider(AccountsRepository)
            .useValue(repo)
            .compile()
        )

        result = await app.inject({
          body: {
            email: faker.internet.email(),
            password: ACCOUNT_PASSWORD,
            type: AccountFactory.role
          },
          headers,
          method,
          url
        })
      })

      it('unhandled error', () => {
        // Arrange
        const code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        const id: ExceptionId = ExceptionId.INTERNAL_SERVER_ERROR

        // Act
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(code)
        expect(payload).to.have.keys(ERROR_PAYLOAD_KEYS)
        expect(payload).to.have.property('code', code)
        expect(payload).to.have.property('id', id)
        expect(payload).to.have.property('message').be.a('string').and.not.empty
        expect(payload).to.have.property('reason', null)
      })
    })
  })

  describe('GET /accounts/whoami', () => {
    let method: Required<InjectOptions>['method']
    let url: string

    beforeAll(() => {
      method = 'get'
      url = routes.ACCOUNTS + subroutes.ACCOUNTS_WHOAMI
    })

    describe('200 (OK)', () => {
      let account: Account
      let auth: AuthService

      beforeAll(() => {
        account = new Account(seeder.seeds[3]!)
        auth = ref.get(AuthService)
      })

      it.each<'accessToken' | 'refreshToken'>([
        'accessToken',
        'refreshToken'
      ])('authenticated user (%s)', async token => {
        // Arrange
        const request: InjectOptions = {
          headers: { authorization: `bearer ${await auth[token](account)}` },
          method,
          url
        }

        // Act
        const result = await app.inject(request)
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(HttpStatus.OK)
        expect(payload).to.have.keys(['uid'])
        expect(payload).to.have.property('uid', account.uid)
      })
    })

    describe('401 (UNAUTHORIZED)', () => {
      let result: Response

      beforeAll(async () => {
        result = await app.inject({
          headers: { authorization: `bearer ${faker.internet.jwt()}` },
          method,
          url
        })
      })

      it('unauthenticated user', () => {
        // Act
        const payload = result.json()

        // Expect
        expect(result).to.be.json.with.status(HttpStatus.UNAUTHORIZED)
        expect(payload).to.have.keys(['uid'])
        expect(payload).to.have.property('uid', null)
      })
    })
  })
})
