import { HttpStatus } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ENV } from '@sneusers/config/configuration'
import { AppService } from '@sneusers/providers'
import createApp from '@tests/utils/create-app.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import TestSubject from '../app.module'

/**
 * @file E2E Tests - AppModule
 * @module sneusers/tests/e2e/AppModule
 */

describe('e2e:AppModule', () => {
  let app: NestExpressApplication
  let req: ChaiHttp.Agent

  before(async () => {
    const ntapp = await createApp({ imports: [TestSubject] })

    app = await ntapp.app.init()
    req = chai.request.agent(app.getHttpServer())
  })

  after(async () => {
    await app.close()
  })

  describe('/', () => {
    const URL = stubURLPath()

    describe('GET', () => {
      describe('200 OK', () => {
        const APP_ENV = ENV.APP_ENV
        const PACKAGE = AppService.package

        let res: ChaiHttp.Response

        before(async () => {
          res = await req.get(URL)
        })

        it('should return api documentation', () => {
          expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        })

        it('should return response with app description', () => {
          expect(res.body.info.description).to.equal(PACKAGE.description)
        })

        it('should return response with app environment and name', () => {
          expect(res.body.info.title).to.equal(`[${APP_ENV}] ${PACKAGE.app}`)
        })

        it('should return response with app version', () => {
          expect(res.body.info.version).to.equal(PACKAGE.version)
        })
      })
    })
  })
})
