/**
 * @file Type Tests - ValidationConstraints
 * @module sneusers/errors/interfaces/tests/unit-d/ValidationConstraints
 */

import type TestSubject from '#errors/interfaces/validation-constraints'

describe('unit-d:errors/interfaces/ValidationConstraints', () => {
  it('should extend Record<string, string>', () => {
    expectTypeOf<TestSubject>().toExtend<Record<string, string>>()
  })
})
