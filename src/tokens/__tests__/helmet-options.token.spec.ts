/**
 * @file Unit Tests - HELMET_OPTIONS
 * @module sneusers/tokens/tests/unit/HELMET_OPTIONS
 */

import TEST_SUBJECT from '../helmet-options.token'

describe('unit:tokens/HELMET_OPTIONS', () => {
  it('should have description "HelmetOptions"', () => {
    expect(TEST_SUBJECT).to.have.property('description').equal('HelmetOptions')
  })
})
