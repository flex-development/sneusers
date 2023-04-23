/**
 * @file Type Tests - HelmetMiddleware
 * @module sneusers/middleware/tests/unit-d/HelmetMiddleware
 */

import type { NestMiddleware } from '@nestjs/common'
import type TestSubject from '../helmet.middleware'

describe('unit-d:middleware/HelmetMiddleware', () => {
  it('should implement NestMiddleware', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<NestMiddleware>()
  })
})
