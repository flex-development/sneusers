/**
 * @file Unit Tests - MissingAccountException
 * @module sneusers/accounts/errors/tests/unit/MissingAccountException
 */

import TestSubject from '#accounts/errors/missing-account.exception'
import Reason from '#accounts/errors/missing-account.reason'
import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'
import { isObjectPlain } from '@flex-development/tutils'
import { ObjectId } from 'bson'

describe('unit:accounts/errors/MissingAccountException', () => {
  describe('constructor', () => {
    let subject: TestSubject
    let uid: ObjectId

    beforeAll(() => {
      subject = new TestSubject(uid = new ObjectId())
    })

    it('should be instanceof Exception', () => {
      expect(subject).to.be.instanceof(Exception)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause').satisfy(isObjectPlain)
      expect(subject.cause).to.have.keys(['uid'])
      expect(subject.cause).to.have.property('uid', String(uid))
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', ExceptionCode.NOT_FOUND)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', ExceptionId.MISSING_ACCOUNT)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', 'Account not found')
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason').be.instanceof(Reason)
      expect(subject.reason).to.have.keys(['uid'])
      expect(subject.reason).to.have.property('uid', String(uid))
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })
})
