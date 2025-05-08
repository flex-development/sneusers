/**
 * @file Unit Tests - InternalServerException
 * @module sneusers/errors/tests/unit/InternalServerException
 */

import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'
import TestSubject from '#errors/models/internal-server.exception'

describe('unit:errors/InternalServerException', () => {
  let message: string

  beforeAll(() => {
    message = 'expected `CreateAccountCommand` instance'
  })

  describe('constructor(info: Error)', () => {
    let info: Error
    let subject: TestSubject

    beforeAll(() => {
      info = new Error(message)
      subject = new TestSubject(new Error(message))
    })

    it('should be instanceof Exception', () => {
      expect(subject).to.be.instanceof(Exception)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', null)
    })

    it('should set #code', () => {
      // Arrange
      const code: ExceptionCode = ExceptionCode.INTERNAL_SERVER_ERROR

      // Expect
      expect(subject).to.have.property('code', code)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', ExceptionId.INTERNAL_SERVER_ERROR)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', info.message)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason', null)
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').not.eq(info.stack)
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })

  describe('constructor(info: string)', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(message)
    })

    it('should be instanceof Exception', () => {
      expect(subject).to.be.instanceof(Exception)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', null)
    })

    it('should set #code', () => {
      // Arrange
      const code: ExceptionCode = ExceptionCode.INTERNAL_SERVER_ERROR

      // Expect
      expect(subject).to.have.property('code', code)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', ExceptionId.INTERNAL_SERVER_ERROR)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', message)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason', null)
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })
})
