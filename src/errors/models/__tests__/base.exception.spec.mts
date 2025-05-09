/**
 * @file Unit Tests - Exception
 * @module sneusers/errors/tests/unit/Exception
 */

import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import TestSubject from '#errors/models/base.exception'
import type { ExceptionInfo, Reason } from '@flex-development/sneusers/errors'
import type { JsonObject } from '@flex-development/sneusers/types'
import { constant } from '@flex-development/tutils'

describe('unit:errors/models/Exception', () => {
  let cause: JsonObject
  let code: ExceptionCode
  let id: ExceptionId
  let info: ExceptionInfo
  let message: string
  let reason: Reason

  beforeAll(() => {
    cause = { email: 'unicornware@sneusers.app' }
    code = ExceptionCode.CONFLICT
    id = ExceptionId.EMAIL_CONFLICT
    message = 'Email address must be unique'
    reason = { toJSON: constant(cause) }

    info = { code, id, message, reason }
  })

  describe('constructor(info)', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(info)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', cause)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', info.code)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', info.id)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', info.message)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason', info.reason)
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })

  describe('constructor(code, id, message, reason)', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(code, id, message, reason)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', cause)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', code)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', id)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', message)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', TestSubject.name)
    })

    it('should set #reason', () => {
      expect(subject).to.have.property('reason', reason)
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })

  describe('#toJSON', () => {
    it('should return error as json object', () => {
      expect(new TestSubject(info).toJSON()).toMatchSnapshot()
    })
  })
})
