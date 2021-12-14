import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { PACKAGE } from '@sneusers/config/constants.config'
import createApp from '@tests/utils/create-app.util'
import stubURLPath from '@tests/utils/stub-url-path.util'
import type { Response, SuperTest, Test } from 'supertest'
import request from 'supertest'
import TestSubject from '../app.module'

/**
 * @file E2E Tests - AppModule
 * @module sneusers/modules/tests/e2e/AppModule
 */

describe('e2e:modules/AppModule', () => {
  let app: INestApplication
  let req: SuperTest<Test>

  before(async () => {
    const { app: napp } = await createApp({ imports: [TestSubject] })

    app = await (app = napp).init()
    req = request(app.getHttpServer())
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
          assert.match(res.headers['content-type'], /application\/json/)
        })

        it(`should return response with status ${HttpStatus.OK}`, () => {
          assert.strictEqual(res.status, HttpStatus.OK)
        })

        it('should return response with project description', () => {
          assert.strictEqual(res.body.info.description, PACKAGE.description)
        })

        it('should return response with project title', () => {
          assert.strictEqual(res.body.info.title, PACKAGE.name.split('/')[1])
        })

        it('should return response with project version', () => {
          assert.strictEqual(res.body.info.version, PACKAGE.version)
        })
      })
    })
  })
})
