/**
 * @file Unit Tests - Mapper
 * @module sneusers/database/providers/tests/unit/Mapper
 */

import Entity from '#database/entities/base.entity'
import TestSubject from '#database/providers/base.mapper'
import DocumentFactory from '#tests/utils/document.factory'
import type SeedFactory from '#tests/utils/seed.factory'
import type { Class } from '@flex-development/tutils'

describe('unit:database/providers/Mapper', () => {
  let Subject: Class<TestSubject>
  let factory: SeedFactory
  let subject: TestSubject

  beforeAll(() => {
    Subject = class Subject extends TestSubject {
      /**
       * @public
       * @static
       * @override
       * @member {string} name
       */
      public static override name: string = Entity.name + 'Mapper'

      /**
       * Entity class.
       *
       * @protected
       * @instance
       * @member {Class<any>} Entity
       */
      protected Entity: Class<any>

      /**
       * Create a new data mapper.
       */
      constructor() {
        super()
        this.Entity = Entity
      }
    }

    factory = new DocumentFactory()
    subject = new Subject()
  })

  describe('#toDomain', () => {
    it('should return instance of `#Entity`', () => {
      expect(subject.toDomain(factory.makeOne())).to.be.instanceof(Entity)
    })
  })

  describe('#toPersistence', () => {
    it('should return `entity` as database record', () => {
      // Arrange
      const entity: Entity = new Entity(factory.makeOne())

      // Act + Expect
      expect(subject.toPersistence(entity)).to.eql(entity.serialize())
    })
  })
})
