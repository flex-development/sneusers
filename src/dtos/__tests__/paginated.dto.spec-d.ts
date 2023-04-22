/**
 * @file Type Tests - PaginatedDTO
 * @module sneusers/dtos/tests/unit-d/PaginatedDTO
 */

import type { ObjectPlain } from '@flex-development/tutils'
import type TestSubject from '../paginated.dto'

describe('unit-d:dtos/PaginatedDTO', () => {
  it('should match [count: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('count').toBeNumber()
  })

  it('should match [limit: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('limit').toBeNumber()
  })

  it('should match [offset: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('offset').toBeNumber()
  })

  it('should match [results: T[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('results')
      .toEqualTypeOf<ObjectPlain[]>()
  })

  it('should match [total: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('total').toBeNumber()
  })
})
