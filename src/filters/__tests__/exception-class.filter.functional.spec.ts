import type { ArgumentsHost } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import EJSON from '@tests/fixtures/exception-json.fixture'
import EXCEPTION from '@tests/fixtures/exception.fixture'
import createApp from '@tests/utils/create-app.util'
import TestSubject from '../exception-class.filter'

/**
 * @file Functional Tests - ExceptionClassFilter
 * @module sneusers/filters/tests/functional/ExceptionClassFilter
 */

describe('functional:filters/ExceptionClassFilter', () => {
  let app: NestExpressApplication
  let subject: TestSubject

  before(async () => {
    app = await createApp()
    subject = new TestSubject(app.get(ConfigService))
  })

  after(async () => {
    await app.close()
  })

  describe('#catch', () => {
    it('should send ExceptionJSON object to client', function (this) {
      // Arrange
      const ejson = { ...EJSON, data: { isExceptionJSON: true, options: {} } }
      const end = this.sandbox.fake()
      const json = this.sandbox.fake(() => ({ end }))
      const status = this.sandbox.fake(() => ({ json }))

      // Act
      subject.catch(EXCEPTION, {
        switchToHttp: () => ({ getResponse: () => ({ end, json, status }) })
      } as unknown as ArgumentsHost)

      // Except
      expect(status).to.be.calledOnceWith(EJSON.code)
      expect(json).to.be.calledOnceWith(ejson)
      expect(end).to.be.calledOnce
    })
  })
})
