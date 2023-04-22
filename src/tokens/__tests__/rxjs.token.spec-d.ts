/**
 * @file Type Tests - RXJS
 * @module sneusers/tokens/tests/unit-d/RXJS
 */

import type TEST_SUBJECT from '../rxjs.token'

describe('unit-d:tokens/RXJS', () => {
  it('should equal type of symbol', () => {
    expectTypeOf<typeof TEST_SUBJECT>().toBeSymbol()
  })
})
