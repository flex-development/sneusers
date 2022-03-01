import FIND_OPTIONS_SEEDED_USERS from '@fixtures/find-options-seeded-users'
import MAGIC_NUMBER from '@fixtures/magic-number.fixture'
import { ExceptionCode } from '@flex-development/exceptions/enums'
import { CacheModule } from '@nestjs/common'
import type { ModuleRef } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SequelizeModule } from '@nestjs/sequelize'
import { Exception } from '@sneusers/exceptions'
import { SequelizeError } from '@sneusers/modules/db/enums'
import { CacheConfigService } from '@sneusers/providers'
import { VerifType } from '@sneusers/subdomains/auth/enums'
import {
  CreateUserDTO,
  PatchUserDTO,
  UpsertUserDTO
} from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import createApp from '@tests/utils/create-app.util'
import { Sequelize } from 'sequelize-typescript'
import TestSubject from '../users.service'

/**
 * @file Unit Tests - UsersService
 * @module sneusers/users/providers/tests/unit/UsersService
 */

describe('unit:subdomains/users/providers/UsersService', () => {
  let app: NestExpressApplication
  let seeds: User[]
  let subject: TestSubject

  before(async () => {
    app = await createApp({
      imports: [
        CacheModule.registerAsync(CacheConfigService.moduleOptions),
        SequelizeModule.forFeature([User])
      ],
      async onModuleInit(ref: ModuleRef): Promise<void> {
        const sequelize = ref.get(Sequelize, { strict: false })
        const repo = sequelize.models.User as typeof User

        subject = ref.get(TestSubject, { strict: false })
        seeds = await repo.findAll(FIND_OPTIONS_SEEDED_USERS)
      },
      providers: [TestSubject]
    })
  })

  after(async () => {
    await app.close()
  })

  describe('#create', () => {
    it('should return User if user was created', async function (this) {
      // Arrange
      const dto = new CreateUserDTO({ email: this.faker.internet.email() })

      // Act
      const result = await subject.create(dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.be.a('number')
      expect(result.display_name).to.be.null
      expect(result.email).to.equal(dto.email.toLowerCase())
      expect(result.email_verified).to.be.false
      expect(result.first_name).to.be.null
      expect(result.id).to.be.a('number')
      expect(result.last_name).to.be.null
      expect(result.password).to.be.null
      expect(result.provider).to.be.null
      expect(result.updated_at).to.be.null
    })

    it('should throw if dto.email is not unique', async () => {
      // Arrange
      const dto = new CreateUserDTO({ email: seeds[2].email })
      let exception: Exception

      // Act
      try {
        await subject.create(dto)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })

  describe('#find', () => {
    it('should return PaginatedDTO<User>', async () => {
      // Act
      const result = await subject.find()

      // Expect
      expect(result).to.be.an('object')
      expect(result.count).to.be.a('number')
      expect(result.limit).to.equal(result.results.length)
      expect(result.offset).to.equal(0)
      expect(result.results).each(user => user.to.be.instanceOf(User))
      expect(result.total).to.be.a('number')
    })
  })

  describe('#findOne', () => {
    it('should return User given uid of existing user', async () => {
      // Arrange
      const uid: User['email'] = seeds[0].email

      // Act
      const result = await subject.findOne(uid)

      // Act
      expect(result).to.be.instanceOf(User)
      expect(result!.created_at).to.be.a('number')
      expect(result!.display_name).to.be.a('string')
      expect(result!.email).to.equal(uid.toLowerCase())
      expect(result!.email_verified).to.be.false
      expect(result!.first_name).to.be.a('string')
      expect(result!.id).to.be.a('number')
      expect(result!.last_name).to.be.a('string')
      expect(result!.password).to.be.a('string')
      expect(result!.provider).to.be.null
      expect(result!.updated_at).to.be.null
    })

    it('should return null if user is not found', async function (this) {
      expect(await subject.findOne(this.faker.name.firstName())).to.be.null
    })

    it('should throw if user is not found', async () => {
      // Arrange
      const uid: User['id'] = seeds.length * -72
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.findOne(uid, { rejectOnEmpty: true })
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.data.error).to.equal(SequelizeError.EmptyResult)
      expect(exception!.data.id).to.equal(uid)
      expect(exception!.message).to.match(new RegExp(uid.toString()))
    })
  })

  describe('#patch', () => {
    it('should return User if user was updated', async function (this) {
      // Arrange
      const uid: User['email'] = seeds[MAGIC_NUMBER].email
      const dto = new PatchUserDTO({ last_name: this.faker.name.lastName() })

      // Act
      const result = await subject.patch(uid, dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.be.a('number')
      expect(result.display_name).to.be.a('string')
      expect(result.email).to.equal(uid.toLowerCase())
      expect(result.email_verified).to.be.false
      expect(result.first_name).to.be.a('string')
      expect(result.id).to.be.a('number')
      expect(result.last_name).to.equal(dto.last_name!.toLowerCase())
      expect(result.password).to.be.a('string')
      expect(result.provider).to.be.null
      expect(result.updated_at).to.not.be.null
    })

    it('should throw if dto.email is not unique', async () => {
      // Arrange
      const uid: User['email'] = seeds[MAGIC_NUMBER].email
      const dto = new PatchUserDTO({ email: seeds[0].email })

      let exception: Exception

      // Act
      try {
        await subject.patch(uid, dto)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
      expect(exception!.code).to.equal(ExceptionCode.CONFLICT)
      expect(exception!.message).to.match(/already exists/)
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.patch(this.faker.internet.exampleEmail())
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })

  describe('#remove', () => {
    it('should return User if user was deleted', async () => {
      // Arrange
      const uid: User['email'] = seeds[seeds.length - 1].email

      // Act
      const result = await subject.remove(uid)

      // Act
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.be.a('number')
      expect(result.display_name).to.be.a('string')
      expect(result.email).to.equal(uid.toLowerCase())
      expect(result.email_verified).to.be.false
      expect(result.first_name).to.be.a('string')
      expect(result.id).to.be.a('number')
      expect(result.last_name).to.be.a('string')
      expect(result.password).to.be.a('string')
      expect(result.provider).to.be.null
      expect(result.updated_at).to.be.null
    })

    it('should throw if user is not found', async function (this) {
      // Arrange
      let exception: Exception<SequelizeError>

      // Act
      try {
        await subject.remove(this.faker.datatype.number() * -1)
      } catch (error) {
        exception = error as typeof exception
      }

      // Expect
      expect(exception!).to.be.instanceOf(Exception)
    })
  })

  describe('#sendEmail', () => {
    it('should return email sent and recipient', async function (this) {
      // Arrange
      const uid: User['email'] = seeds[5].email
      const url = this.faker.internet.url()

      // Act
      const result = await subject.sendEmail(uid, {
        context: { url: `${url}?type=${VerifType.EMAIL}&token=token` },
        template: 'email/verification',
        text: 'hello!'
      })

      // Expect
      expect(result.email).to.not.be.undefined
      expect(result.email.envelope.to).to.have.deep.ordered.members([uid])
      expect(result.user).to.be.instanceOf(User)
      expect(result.user.email).to.equal(uid)
    })
  })

  describe('#upsert', () => {
    it('should return new User', async () => {
      // Arrange
      const dto = new UpsertUserDTO({
        display_name: 'john',
        email: 'john@appleseed.com',
        first_name: 'john',
        last_name: 'appleseed'
      })

      // Act
      const result = await subject.upsert(dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.be.a('number')
      expect(result.display_name).to.equal(dto.display_name!.toLowerCase())
      expect(result.email).to.equal(dto.email!.toLowerCase())
      expect(result.email_verified).to.be.false
      expect(result.first_name).to.equal(dto.first_name!.toLowerCase())
      expect(result.id).to.be.a('number')
      expect(result.last_name).to.equal(dto.last_name!.toLowerCase())
      expect(result.password).to.be.null
      expect(result.provider).to.be.null
      expect(result.updated_at).to.be.null
    })

    it('should return updated user', async function (this) {
      // Arrange
      const id: User['id'] = seeds[seeds.length - 4].id
      const dto = new UpsertUserDTO({ email: this.faker.internet.email(), id })

      // Act
      const result = await subject.upsert(dto)

      // Expect
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.be.a('number')
      expect(result.display_name).to.be.a('string')
      expect(result.email).to.equal(dto.email!.toLowerCase())
      expect(result.email_verified).to.be.false
      expect(result.first_name).to.be.a('string')
      expect(result.id).to.be.a('number')
      expect(result.last_name).to.be.a('string')
      expect(result.password).to.be.a('string')
      expect(result.provider).to.be.null
      expect(result.updated_at).to.not.be.null
    })
  })

  describe('#verifyEmail', () => {
    it('should return verified User', async () => {
      // Arrange
      const uid: User['id'] = seeds[1].id

      // Act
      const result = await subject.verifyEmail(uid)

      // Act
      expect(result).to.be.instanceOf(User)
      expect(result.created_at).to.be.a('number')
      expect(result.display_name).to.be.a('string')
      expect(result.email).to.be.a('string')
      expect(result.email_verified).to.be.true
      expect(result.first_name).to.be.a('string')
      expect(result.id).to.equal(uid)
      expect(result.last_name).to.be.a('string')
      expect(result.password).to.be.a('string')
      expect(result.provider).to.be.null
      expect(result.updated_at).to.not.be.null
    })
  })
})
