/**
 * @file E2E Tests - DocsController
 * @module sneusers/subdomains/docs/controllers/tests/e2e/Docs
 */

import pkg from '#package.json' assert { type: 'json' }
import { Endpoint } from '#src/enums'
import { RxJSProvider } from '#src/providers'
import createTestingModule from '#tests/utils/create-testing-module'
import url from '#tests/utils/url'
import { HttpService } from '@nestjs/axios'
import { HttpStatus } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { OpenAPIObject } from '@nestjs/swagger'
import type { TestingModule } from '@nestjs/testing'
import type { AxiosResponse } from 'axios'
import { Observable } from 'rxjs'
import TestSubject from '../docs.controller'

describe('e2e:subdomains/docs/controllers/DocsController', () => {
  let app: NestExpressApplication
  let openapi: OpenAPIObject
  let ref: TestingModule
  let req: ChaiHttp.Agent

  beforeAll(async () => {
    openapi = {
      openapi: '3.0.0',
      paths: {
        '/health': {
          get: {
            operationId: 'HealthController#get',
            parameters: [],
            responses: {
              '200': {
                description: 'Health check successful',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'ok' },
                        info: {
                          type: 'object',
                          example: { database: { status: 'up' } },
                          additionalProperties: {
                            type: 'object',
                            properties: { status: { type: 'string' } },
                            additionalProperties: { type: 'string' }
                          },
                          nullable: true
                        },
                        error: {
                          type: 'object',
                          example: {},
                          additionalProperties: {
                            type: 'object',
                            properties: { status: { type: 'string' } },
                            additionalProperties: { type: 'string' }
                          },
                          nullable: true
                        },
                        details: {
                          type: 'object',
                          example: { database: { status: 'up' } },
                          additionalProperties: {
                            type: 'object',
                            properties: { status: { type: 'string' } },
                            additionalProperties: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '503': {
                description: 'Health check failed',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'error' },
                        info: {
                          type: 'object',
                          example: { database: { status: 'up' } },
                          additionalProperties: {
                            type: 'object',
                            properties: { status: { type: 'string' } },
                            additionalProperties: { type: 'string' }
                          },
                          nullable: true
                        },
                        error: {
                          type: 'object',
                          example: {
                            redis: {
                              status: 'down',
                              message: 'Could not connect'
                            }
                          },
                          additionalProperties: {
                            type: 'object',
                            properties: { status: { type: 'string' } },
                            additionalProperties: { type: 'string' }
                          },
                          nullable: true
                        },
                        details: {
                          type: 'object',
                          example: {
                            database: { status: 'up' },
                            redis: {
                              status: 'down',
                              message: 'Could not connect'
                            }
                          },
                          additionalProperties: {
                            type: 'object',
                            properties: { status: { type: 'string' } },
                            additionalProperties: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            tags: ['health']
          }
        }
      },
      info: {
        title: '@flex-development/sneusers',
        description: pkg.description,
        version: pkg.version,
        contact: {},
        license: {
          name: pkg.license,
          url: pkg.homepage + '/blob/main/LICENSE.md'
        }
      },
      tags: [],
      servers: [],
      components: {},
      externalDocs: {
        description: 'GitHub Repository',
        url: pkg.homepage
      }
    }

    ref = await createTestingModule({
      controllers: [TestSubject],
      providers: [
        RxJSProvider,
        {
          provide: HttpService,
          useValue: {
            get: vi.fn((): Observable<AxiosResponse<OpenAPIObject>> => {
              return new Observable<AxiosResponse<OpenAPIObject>>(sub => {
                sub.next({ data: openapi } as AxiosResponse<OpenAPIObject>)
                sub.complete()
              })
            })
          }
        }
      ]
    })

    app = await ref.createNestApplication<typeof app>().init()
    req = request.agent(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  describe(Endpoint.DOCS, () => {
    describe('GET', () => {
      it('should respond with openapi specification object', async () => {
        // Act
        const res = await req.get(url(Endpoint.DOCS))

        // Expect
        expect(res).to.be.json.with.status(HttpStatus.OK)
        expect(res.body).to.deep.equal(openapi)
      })
    })
  })
})
