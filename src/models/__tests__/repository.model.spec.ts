/**
 * @file Unit Tests - Repository
 * @module sneusers/models/tests/unit/Repository
 */

import Account from '#fixtures/account.entity'
import AccountFactory from '#fixtures/account.factory'
import DatabaseModule from '#src/database/database.module'
import createTestingModule from '#tests/utils/create-testing-module'
import { ValidationError } from '@mikro-orm/core'
import { MongoEntityManager } from '@mikro-orm/mongodb'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { TestingModule } from '@nestjs/testing'
import * as validator from 'class-validator'
import TestSubject from '../repository.model'

describe('unit:models/Repository', () => {
  let em: MongoEntityManager
  let factory: AccountFactory
  let ref: TestingModule
  let subject: TestSubject<Account>

  beforeAll(async () => {
    ref = await createTestingModule({
      imports: [DatabaseModule, MikroOrmModule.forFeature([Account])]
    })

    em = ref.get(MongoEntityManager).fork()
    factory = new AccountFactory(em)
    subject = new TestSubject(em, Account)
  })

  describe('#create', () => {
    it('should return new entity instance', async () => {
      // Arrange
      const email: string = faker.internet.email()
      const account: Account = new Account({ email })

      // Act
      const result = subject.create({ email })

      // Expect
      expect(result).to.be.instanceof(Account)
      expect(result).to.have.property('email').equal(account.email)
    })
  })

  describe('#validate', () => {
    it('should return validated entity instance', () => {
      // Arrange
      const account: Account = factory.makeOne()

      // Act + Expect
      expect(subject.validate(account)).to.deep.equal(account)
    })

    it('should throw if entity validation fails', () => {
      // Arrange
      const entity: Account = new Account({ email: '' })
      let error!: ValidationError

      // Act
      try {
        subject.validate(entity)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(ValidationError)
      expect(error).to.have.property('entity').deep.equal(entity)
      expect(error).to.have.property('message').equal('Validation failed')
      expect(error)
        .to.have.property('cause')
        .that.is.an('array')
        .of.length(1)
        .and.each.instanceof(validator.ValidationError)
    })
  })
})
