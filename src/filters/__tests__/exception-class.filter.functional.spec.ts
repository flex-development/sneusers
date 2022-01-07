import type { ArgumentsHost } from '@nestjs/common'
import EJSON from '@tests/fixtures/exception-json.fixture'
import EXCEPTION from '@tests/fixtures/exception.fixture'
import TestSubject from '../exception-class.filter'

/**
 * @file Functional Tests - ExceptionClassFilter
 * @module sneusers/filters/tests/functional/ExceptionClassFilter
 */

describe('functional:filters/ExceptionClassFilter', () => {
  describe('#catch', () => {
    it('should send ExceptionJSON object to client', function (this) {
      // Arrange
      const end = this.sandbox.fake()
      const json = this.sandbox.fake(() => ({ end }))
      const status = this.sandbox.fake(() => ({ json }))

      // Act
      new TestSubject().catch(EXCEPTION, {
        switchToHttp: () => ({ getResponse: () => ({ end, json, status }) })
      } as unknown as ArgumentsHost)

      // Except
      expect(status).to.be.calledOnceWith(EXCEPTION.code)
      expect(json).to.be.calledOnceWith({ ...EJSON, data: { options: {} } })
      expect(end).to.be.calledOnce
    })
  })
})
