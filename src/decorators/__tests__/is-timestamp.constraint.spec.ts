/**
 * @file Unit Tests - IsTimestampConstraint
 * @module sneusers/decorators/tests/unit/IsTimestampConstraint
 */

import type { ValidationArguments } from 'class-validator'
import TestSubject from '../is-timestamp.constraint'

describe('unit:decorators/IsTimestampConstraint', () => {
  let subject: TestSubject

  beforeAll(() => {
    subject = new TestSubject()
  })

  describe('.options', () => {
    let options: { async: boolean; name: string }

    beforeAll(() => {
      options = TestSubject.options
    })

    describe('async', () => {
      it('should equal false', () => {
        expect(options).to.have.property('async').be.false
      })
    })

    describe('name', () => {
      it('should equal "isTimestamp"', () => {
        expect(options).to.have.property('name').equal('isTimestamp')
      })
    })
  })

  describe('#defaultMessage', () => {
    it('should return default validator error message', () => {
      // Act
      const result = subject.defaultMessage({
        constraints: [],
        object: {},
        property: 'created_at',
        targetName: 'User',
        value: null
      } as ValidationArguments)

      // Expect
      expect(result).to.equal('$property must be a valid unix timestamp')
    })
  })

  describe('#validate', () => {
    it('should return false if value is not unix timestamp', () => {
      expect(subject.validate(null)).to.be.false
    })

    it('should return true if value is unix timestamp', () => {
      expect(subject.validate(Date.now())).to.be.true
    })
  })
})
