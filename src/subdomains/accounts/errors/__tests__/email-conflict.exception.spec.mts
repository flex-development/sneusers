/**
 * @file Unit Tests - EmailConflictException
 * @module sneusers/accounts/errors/tests/unit/EmailConflictException
 */

import TestSubject from '#accounts/errors/email-conflict.exception'
import Reason from '#accounts/errors/email-conflict.reason'
import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'
import { isObjectPlain } from '@flex-development/tutils'

describe('unit:accounts/errors/EmailConflictException', () => {
  describe('constructor', () => {
    let email: string
    let subject: TestSubject

    beforeAll(() => {
      email = faker.internet.email()
      subject = new TestSubject(email)
    })

    it('should be instanceof Exception', () => {
      expect(subject).to.be.instanceof(Exception)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause').satisfy(isObjectPlain)
      expect(subject.cause).to.have.keys(['email'])
      expect(subject.cause).to.have.property('email', email)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', ExceptionCode.CONFLICT)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', ExceptionId.EMAIL_CONFLICT)
    })

    it('should set #message', () => {
      // Arrange
      const message: string = 'Email address must be unique'

      // Expect
      expect(subject).to.have.property('message', message)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason').be.instanceof(Reason)
      expect(subject.reason).to.have.keys(['email'])
      expect(subject.reason).to.have.property('email', email)
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })
})
