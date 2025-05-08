/**
 * @file Unit Tests - ValidationException
 * @module sneusers/errors/tests/unit/ValidationException
 */

import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'
import TestSubject from '#errors/models/validation.exception'
import Reason from '#errors/models/validation.reason'
import { isObjectPlain } from '@flex-development/tutils'
import { ObjectId } from 'bson'
import type { ValidationError } from 'class-validator'

describe('unit:errors/ValidationException', () => {
  let info: ValidationError

  beforeAll(() => {
    info = {
      constraints: { isInstance: '_id must be an instance of ObjectId' },
      property: '_id',
      value: String(new ObjectId())
    }
  })

  describe('constructor(info)', () => {
    let reasonKeys: string[]
    let subject: TestSubject

    beforeAll(() => {
      reasonKeys = ['constraints', 'property', 'value']
      subject = new TestSubject(info)
    })

    it('should be instanceof Exception', () => {
      expect(subject).to.be.instanceof(Exception)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause').satisfy(isObjectPlain)
      expect(subject.cause).to.have.keys(reasonKeys)
      expect(subject.cause).to.have.property('constraints', info.constraints)
      expect(subject.cause).to.have.property('property', info.property)
      expect(subject.cause).to.have.property('value', info.value)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', ExceptionCode.BAD_REQUEST)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', ExceptionId.VALIDATION_FAILURE)
    })

    it('should set #message', () => {
      // Arrange
      const message: string = `Property ${info.property} is invalid`

      // Expect
      expect(subject).to.have.property('message', message)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason').be.instanceof(Reason)
      expect(subject.reason).to.have.keys(reasonKeys)
      expect(subject.reason).to.have.property('constraints', info.constraints)
      expect(subject.reason).to.have.property('property', info.property)
      expect(subject.reason).to.have.property('value', info.value)
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })
})
