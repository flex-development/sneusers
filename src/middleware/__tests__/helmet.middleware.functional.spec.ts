/**
 * @file Functional Tests - HelmetMiddleware
 * @module sneusers/middleware/tests/functional/HelmetMiddleware
 */

import { HelmetOptionsProvider } from '#src/providers'
import type { Mock } from '#tests/interfaces'
import createTestingModule from '#tests/utils/create-testing-module'
import type { TestingModule } from '@nestjs/testing'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import TestSubject from '../helmet.middleware'

vi.mock('helmet', () => ({ default: vi.fn().mockName('helmet') }))

describe('functional:middleware/HelmetMiddleware', () => {
  let handler: Mock<ReturnType<typeof helmet>>
  let next: NextFunction
  let ref: TestingModule
  let req: Request
  let res: Response

  beforeAll(async () => {
    handler = vi.fn().mockName('handler')
    next = vi.fn().mockName('next')
    req = {} as typeof req
    res = {} as typeof res

    ref = await createTestingModule({
      exports: [TestSubject],
      providers: [HelmetOptionsProvider, TestSubject]
    })
  })

  beforeEach(() => {
    vi.mocked(helmet).mockImplementation(() => handler)
    ref.get(TestSubject).use(req, res, next)
  })

  it('should configure helmet', () => {
    expect(helmet).toHaveBeenCalledOnce()
    expect(helmet).toHaveBeenCalledWith(HelmetOptionsProvider.useValue)
  })

  it('should apply helmet middleware', () => {
    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith(req, res, next)
  })
})
