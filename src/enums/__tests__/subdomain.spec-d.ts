/**
 * @file Type Tests - Subdomain
 * @module sneusers/enums/tests/unit-d/Subdomain
 */

import type TestSubject from '../subdomain'

describe('unit-d:enums/Subdomain', () => {
  it('should match [DATABASE = "database"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DATABASE')
      .toMatchTypeOf<'database'>()
  })

  it('should match [DOCS = "docs"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DOCS')
      .toMatchTypeOf<'docs'>()
  })

  it('should match [HEALTH = "health"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('HEALTH')
      .toMatchTypeOf<'health'>()
  })
})
