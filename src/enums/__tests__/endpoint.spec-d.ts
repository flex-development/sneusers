/**
 * @file Type Tests - Endpoint
 * @module sneusers/enums/tests/unit-d/Endpoint
 */

import type TestSubject from '../endpoint'

describe('unit-d:enums/Endpoint', () => {
  it('should match [DOCS = "/"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DOCS')
      .toMatchTypeOf<'/'>()
  })

  it('should match [HEALTH = "/health"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('HEALTH')
      .toMatchTypeOf<'/health'>()
  })
})
