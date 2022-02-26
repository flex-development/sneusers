import TestSubject from '../entity.dao'

/**
 * @file Unit Tests - Entity
 * @module sneusers/modules/db/entities/tests/unit/Entity
 */

describe('unit:modules/database/entities/Entity', () => {
  describe('.getSearchOptions', () => {
    it.skip('should convert QueryParams into SearchOptions', () => {
      //
    })
  })

  describe('.isUnixTimestamp', () => {
    it('should return true if value is unix timestamp', () => {
      expect(TestSubject.isUnixTimestamp(Date.now())).to.be.true
    })

    it('should throw if value is not unix timestamp', () => {
      // Arrange
      let error: Error

      // Act
      try {
        TestSubject.isUnixTimestamp(new Date().toISOString())
      } catch (e) {
        error = e as typeof error
      }

      expect(error!).to.be.instanceOf(Error)
      expect(error!.message).to.equal('Must be a unix timestamp')
    })
  })
})
