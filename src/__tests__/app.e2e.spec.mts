/**
 * @file E2E Tests - app
 * @module sneusers/tests/e2e/app
 */

import testSubject from '#app'
import routes from '#enums/routes'
import { ConsoleLogger, HttpStatus } from '@nestjs/common'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import type { Response } from 'light-my-request'

describe('e2e:app', () => {
  let subject: NestFastifyApplication

  afterAll(async () => {
    await subject.close()
  })

  beforeAll(async () => {
    vi.spyOn(ConsoleLogger.prototype, 'log').mockImplementation(vi.fn())

    subject = await testSubject()

    await subject.init()
    await subject.getHttpAdapter().getInstance().ready()
  })

  describe('GET /', () => {
    let result: Response

    beforeAll(async () => {
      result = await subject.inject({ method: 'get', url: routes.APP })
    })

    it('should respond with api documentation (json)', () => {
      expect(result).to.have.status(HttpStatus.OK)
      expect(result).to.be.json
      expect(result.json()).toMatchSnapshot()
    })
  })
})
