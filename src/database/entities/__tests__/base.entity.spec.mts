/**
 * @file Unit Tests - Entity
 * @module sneusers/database/entities/tests/unit/Entity
 */

import TestSubject from '#database/entities/base.entity'
import DocumentFactory from '#tests/utils/document.factory'
import type SeedFactory from '#tests/utils/seed.factory'
import type { EntityData, IDocument } from '@flex-development/sneusers/database'
import { ValidationException } from '@flex-development/sneusers/errors'
import { isObjectPlain, omit } from '@flex-development/tutils'
import { ObjectId } from 'bson'

describe('unit:database/entities/Entity', () => {
  let factory: SeedFactory

  beforeAll(() => {
    factory = new DocumentFactory()
  })

  describe('constructor', () => {
    let props: EntityData
    let subject: TestSubject

    beforeAll(() => {
      props = omit(factory.makeOne(), ['_id'])
      subject = new TestSubject(props)
    })

    it('should not automatically commit events', () => {
      expect(subject).to.have.property('autoCommit', false)
    })

    it('should set #_id', () => {
      expect(subject).to.have.property('_id').not.eq(props._id)
      expect(subject).to.have.property('_id').to.be.instanceof(ObjectId)
    })

    it('should set #created_at', () => {
      expect(subject).to.have.property('created_at', props.created_at)
    })

    it('should set #updated_at', () => {
      expect(subject).to.have.property('updated_at', props.updated_at)
    })
  })

  describe('#serialize', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(factory.makeOne())
    })

    it('should return entity as database record', () => {
      // Arrange
      const keys: string[] = ['_id', 'created_at', 'updated_at']

      // Act
      const result = subject.serialize()

      // Expect
      expect(result).to.not.eq(subject).and.not.be.instanceof(TestSubject)
      expect(result).to.satisfy(isObjectPlain)
      expect(result).to.have.keys(keys)
      expect(result).to.have.property('_id', subject._id)
      expect(result).to.have.property('created_at', subject.created_at)
      expect(result).to.have.property('updated_at', subject.updated_at)
    })
  })

  describe('#uid', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(factory.makeOne())
    })

    it('should be json-friendly representation of `_id`', () => {
      expect(subject).to.have.property('uid', String(subject._id))
    })
  })

  describe('#validate', () => {
    it('should return `this` entity on successful validation', () => {
      // Arrange
      const subject: TestSubject = new TestSubject(factory.makeOne())

      // Act + Expect
      expect(subject.validate()).to.eq(subject)
    })

    it.each<Record<keyof IDocument, any>>([
      {
        _id: '67fedcf4cd1c5d548c5720f5',
        created_at: Date.now(),
        updated_at: null
      },
      {
        _id: new ObjectId(),
        created_at: null,
        updated_at: Date.now()
      },
      {
        _id: new ObjectId(),
        created_at: Date.now(),
        updated_at: Number.NEGATIVE_INFINITY
      }
    ])('should throw on validation failure (%#)', props => {
      // Arrange
      let error!: ValidationException

      // Act
      try {
        new TestSubject(props).validate()
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(ValidationException)
    })
  })
})
