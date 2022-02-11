import {
  ExceptionClassName,
  ExceptionCode,
  ExceptionId
} from '@flex-development/exceptions/enums'
import type { ArgumentsHost } from '@nestjs/common'
import { BadRequestException, HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { Exception } from '@sneusers/exceptions'
import type { ExceptionJSON } from '@sneusers/interfaces'
import createApp from '@tests/utils/create-app.util'
import type { Testcase } from '@tests/utils/types'
import TestSubject from '../http-exception.filter'

/**
 * @file Functional Tests - HttpExceptionFilter
 * @module sneusers/filters/tests/functional/HttpExceptionFilter
 */

describe('functional:filters/HttpExceptionFilter', () => {
  let app: NestExpressApplication
  let subject: TestSubject

  before(async () => {
    const ntapp = await createApp()

    app = await ntapp.app.init()
    subject = new TestSubject(app.get(ConfigService))
  })

  after(async () => {
    await app.close()
  })

  describe('#catch', () => {
    describe('sends ExceptionJSON object to client', () => {
      type Case = Testcase<ExceptionJSON> & {
        exception: HttpException
        testcase: string
      }

      const cases: Case[] = [
        ((): Case => {
          const code = ExceptionCode.INTERNAL_SERVER_ERROR
          const exception = new HttpException('', code)

          return {
            exception,
            expected: {
              className: ExceptionClassName.INTERNAL_SERVER_ERROR,
              code,
              data: { isExceptionJSON: true },
              errors: [],
              message: Exception.DEFAULT_MESSAGE,
              name: ExceptionId.INTERNAL_SERVER_ERROR,
              stack: exception.stack
            },
            testcase: 'handle HttpException'
          }
        })(),
        ((): Case => {
          const body = { message: ['email must be an email'] }
          const exception = new BadRequestException(body)

          return {
            exception,
            expected: {
              className: ExceptionClassName.BAD_REQUEST,
              code: ExceptionCode.BAD_REQUEST,
              data: { isExceptionJSON: true },
              errors: body.message,
              message: 'Bad Request Exception',
              name: ExceptionId.BAD_REQUEST,
              stack: exception.stack
            },
            testcase: 'set #errors === BadRequestException#response.message'
          }
        })()
      ]

      cases.forEach(({ exception, expected, testcase }) => {
        it(`should ${testcase}`, function (this) {
          // Arrange
          const end = this.sandbox.fake()
          const json = this.sandbox.fake(() => ({ end }))
          const status = this.sandbox.fake(() => ({ json }))

          // Act
          subject.catch(exception, {
            switchToHttp: () => ({ getResponse: () => ({ end, json, status }) })
          } as unknown as ArgumentsHost)

          // Except
          expect(status).to.be.calledOnceWith(expected.code)
          expect(json).to.be.calledOnceWith(expected)
          expect(end).to.be.calledOnce
        })
      })
    })
  })
})
