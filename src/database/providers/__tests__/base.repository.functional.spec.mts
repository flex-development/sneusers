/**
 * @file Functional Tests - Repository
 * @module sneusers/database/providers/tests/functional/Repository
 */

import DatabaseModule from '#database/database.module'
import Entity from '#database/entities/base.entity'
import TestSubject from '#database/providers/base.repository'
import DocumentFactory from '#tests/utils/document.factory'
import type SeedFactory from '#tests/utils/seed.factory'
import Seeder from '#tests/utils/seeder'
import type { IDocument, Mapper } from '@flex-development/sneusers/database'
import { equal } from '@flex-development/tutils'
import { ObjectId } from 'bson'

describe('functional:database/providers/Repository', () => {
  let factory: SeedFactory
  let mapper: Mapper

  beforeAll(() => {
    factory = new DocumentFactory()
    mapper = new (DatabaseModule.Mapper(Entity))()
  })

  describe('constructor', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(mapper)
    })

    it('should initialize repository', () => {
      expect(subject).to.have.property('mapper', mapper)
      expect(subject).to.have.property('store').be.instanceof(Map)
      expect(subject).to.have.nested.property('store.size', 0)
    })
  })

  describe('#delete', () => {
    let record: IDocument
    let seeder: Seeder
    let subject: TestSubject

    afterAll(async () => {
      await seeder.down()
    })

    beforeAll(async () => {
      subject = new TestSubject(mapper)
      seeder = await new Seeder(factory, subject).up(1)
      record = seeder.seeds[0]!
    })

    it('should return entity representing deleted record', async () => {
      // Act
      const result = await subject.delete(record._id)

      // Expect
      expect(result).to.be.instanceof(Entity)
      expect(result).to.have.property('uid', String(record._id))
      expect(subject).to.have.nested.property('store.size', 0)
    })
  })

  describe('#entities', () => {
    let count: number
    let seeder: Seeder
    let subject: TestSubject

    afterAll(async () => {
      await seeder.down()
    })

    beforeAll(async () => {
      count = faker.number.int({ max: 13, min: 3 })
      subject = new TestSubject(mapper)
      seeder = await new Seeder(factory, subject).up(count)
    })

    it('should be list of `Entity` instances', () => {
      // Act
      const result = subject.entities

      // Expect
      expect(result).to.be.an('array').that.is.not.empty
      expect(result).to.be.of.length(count)
      expect(result).each.to.be.instanceof(Entity)
    })
  })

  describe('#findById', () => {
    let record: IDocument
    let seeder: Seeder
    let subject: TestSubject

    afterAll(async () => {
      await seeder.down()
    })

    beforeAll(async () => {
      subject = new TestSubject(mapper)
      seeder = await new Seeder(factory, subject).up()
      record = seeder.seeds[3]!
    })

    it('should return `null` if matching entity is not found', async () => {
      expect(await subject.findById(new ObjectId())).to.be.null
    })

    it('should return entity representing matched record', async () => {
      // Act
      const result = await subject.findById(record._id)

      // Expect
      expect(result).to.be.instanceof(Entity)
      expect(result).to.have.property('uid', String(record._id))
    })
  })

  describe('#insert', () => {
    let entity: Entity
    let has: (store: Map<string, IDocument>) => boolean
    let subject: TestSubject

    beforeAll(() => {
      entity = mapper.toDomain(factory.makeOne())
      subject = new TestSubject(mapper)

      /**
       * Check if `store` contains a record for {@linkcode entity}.
       *
       * @this {void}
       *
       * @param {Map<string, IDocument>} store
       *  Database record store
       * @return {boolean}
       *  `true` if `store` contains record, `false` otherwise
       */
      has = function has(this: void, store: Map<string, IDocument>): boolean {
        return equal(store.get(entity.uid), mapper.toPersistence(entity))
      }
    })

    it('should add new record', async () => {
      // Act
      const result = await subject.insert(entity)

      // Expect
      expect(result).to.be.instanceof(ObjectId).and.eq(entity._id)
      expect(subject).to.have.nested.property('store.size', 1)
      expect(subject).to.have.property('store').satisfy(has)
    })
  })

  describe('#records', () => {
    let count: number
    let factory: SeedFactory
    let seeder: Seeder
    let subject: TestSubject

    afterAll(async () => {
      await seeder.down()
    })

    beforeAll(async () => {
      count = faker.number.int({ max: 13, min: 3 })
      factory = new DocumentFactory()
      subject = new TestSubject(mapper)

      seeder = await new Seeder(factory, subject).up(count)
    })

    it('should be list of database records', () => {
      // Arrange
      const keys: string[] = ['_id', 'created_at', 'updated_at']

      // Act
      const result = subject.records

      // Expect
      expect(result).to.be.an('array').that.is.not.empty
      expect(result).to.be.of.length(count)
      expect(result).each.to.not.be.instanceof(Entity)
      expect(result).each.to.have.keys(keys)
    })
  })
})
