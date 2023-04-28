/**
 * @file Type Tests - DatabaseCollection
 * @module sneusers/enums/tests/unit-d/DatabaseCollection
 */

import type TestSubject from '../database-collection'

describe('unit-d:enums/DatabaseCollection', () => {
  it('should match [USERS = "users"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('USERS')
      .toMatchTypeOf<'users'>()
  })
})
