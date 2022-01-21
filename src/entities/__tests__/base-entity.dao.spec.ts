import TestSubject from '../base-entity.dao'

/**
 * @file Unit Tests - BaseEntity
 * @module sneusers/entities/tests/unit/BaseEntity
 */

describe('unit:entities/BaseEntity', () => {
  describe('.checkTimestamp', () => {
    it('should return true if value is unix timestamp', () => {
      expect(TestSubject.checkUnixTimestamp(Date.now())).to.be.true
    })

    it('should throw if value is not unix timestamp', () => {
      // Arrange
      let error: Error

      // Act
      try {
        TestSubject.checkUnixTimestamp(new Date().toISOString())
      } catch (e) {
        error = e as typeof error
      }

      expect(error!).to.be.instanceOf(Error)
      expect(error!.message).to.equal('Must be a unix timestamp')
    })
  })
})
