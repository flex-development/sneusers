/**
 * @file Unit Tests - AccessDeniedException
 * @module sneusers/accounts/errors/tests/unit/AccessDeniedException
 */

import TestSubject from '#accounts/errors/access-denied.exception'
import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'

describe('unit:accounts/errors/AccessDeniedException', () => {
  describe('constructor', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject()
    })

    it('should be instanceof Exception', () => {
      expect(subject).to.be.instanceof(Exception)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', null)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', ExceptionCode.FORBIDDEN)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', ExceptionId.ACCESS_DENIED)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', 'Access denied')
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
