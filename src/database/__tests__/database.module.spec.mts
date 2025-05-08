/**
 * @file Unit Tests - DatabaseModule
 * @module sneusers/database/tests/unit/DatabaseModule
 */

import TestSubject from '#database/database.module'
import Entity from '#database/entities/base.entity'
import Mapper from '#database/providers/base.mapper'

describe('unit:database/DatabaseModule', () => {
  describe('.Mapper', () => {
    it('should return data mapper class', () => {
      // Act
      const Result = TestSubject.Mapper(Entity)
      const res = new Result()

      // Expect
      expect(Result).to.have.property('name', Entity.name + 'Mapper')
      expect(res).to.have.property('Entity', Entity)
      expect(res).to.have.property('name', Result.name)
      expect(res).to.be.instanceof(Mapper)
    })
  })

  describe('.forFeature', () => {
    it('should return dynamic feature module', () => {
      expect(TestSubject.forFeature(Entity)).toMatchSnapshot()
    })
  })
})
