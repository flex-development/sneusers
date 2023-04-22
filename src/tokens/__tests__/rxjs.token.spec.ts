/**
 * @file Unit Tests - RXJS
 * @module sneusers/tokens/tests/unit/RXJS
 */

import TEST_SUBJECT from '../rxjs.token'

describe('unit:tokens/RXJS', () => {
  it('should have description "rxjs"', () => {
    expect(TEST_SUBJECT).to.have.property('description').equal('rxjs')
  })
})
