/**
 * @file Type Tests - HELMET_OPTIONS
 * @module sneusers/tokens/tests/unit-d/HELMET_OPTIONS
 */

import type TEST_SUBJECT from '../helmet-options.token'

describe('unit-d:tokens/HELMET_OPTIONS', () => {
  it('should equal type of symbol', () => {
    expectTypeOf<typeof TEST_SUBJECT>().toBeSymbol()
  })
})
