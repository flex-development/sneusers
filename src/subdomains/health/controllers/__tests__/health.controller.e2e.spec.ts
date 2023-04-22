/**
 * @file E2E Tests - HealthController
 * @module sneusers/subdomains/health/controllers/tests/e2e/Health
 */

import { Endpoint } from '#src/enums'
import createTestingModule from '#tests/utils/create-testing-module'
import url from '#tests/utils/url'
import { HttpModule } from '@nestjs/axios'
import { HttpStatus } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { TerminusModule } from '@nestjs/terminus'
import type { TestingModule } from '@nestjs/testing'
import TestSubject from '../health.controller'

describe('e2e:subdomains/health/controllers/HealthController', () => {
  let app: NestExpressApplication
  let ref: TestingModule
  let req: ChaiHttp.Agent

  beforeAll(async () => {
    ref = await createTestingModule({
      controllers: [TestSubject],
      imports: [
        HttpModule.register({ baseURL: 'https://docs.nestjs.com' }),
        TerminusModule
      ]
    })

    app = await ref.createNestApplication<typeof app>().init()
    req = request.agent(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  describe(Endpoint.HEALTH, () => {
    describe('GET', () => {
      it('should respond with health check result', async () => {
        // Act
        const res = await req.get(url(Endpoint.HEALTH))

        // Expect
        expect(res).to.be.json.with.status(HttpStatus.OK)
        expect(res.body).toMatchSnapshot()
      })
    })
  })
})
