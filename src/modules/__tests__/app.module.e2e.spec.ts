import { HttpStatus } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { PACKAGE } from '@sneusers/config/constants.config'
import createApp from '@tests/utils/create-app.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { Response } from 'superagent'
import TestSubject from '../app.module'

/**
 * @file E2E Tests - AppModule
 * @module sneusers/modules/tests/e2e/AppModule
 */

describe('e2e:modules/AppModule', () => {
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
        let res: Response

        before(async () => {
          res = await req.get(URL)
        })

        it('should return api documentation', () => {
          expect(res).to.be.jsonResponse(HttpStatus.OK, 'object')
        })

        it('should return response with project description', () => {
          expect(res.body.info.description).to.equal(PACKAGE.description)
        })

        it('should return response with project title', () => {
          expect(res.body.info.title).to.equal(PACKAGE.name.split('/')[1])
        })

        it('should return response with project version', () => {
          expect(res.body.info.version).to.equal(PACKAGE.version)
        })
      })
    })
  })
})
