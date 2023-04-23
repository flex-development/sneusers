/**
 * @file Unit Tests - HelmetOptionsProvider
 * @module sneusers/providers/tests/unit/HelmetOptionsProvider
 */

import { HELMET_OPTIONS } from '#src/tokens'
import { isObjectPlain } from '@flex-development/tutils'
import TestSubject from '../helmet-options.provider'

describe('unit:providers/HelmetOptionsProvider', () => {
  it('should provide HELMET_OPTIONS', () => {
    expect(TestSubject).to.have.property('provide').deep.equal(HELMET_OPTIONS)
  })

  it('should use HelmetOptions object as value', () => {
    expect(TestSubject).to.have.property('useValue').satisfy(isObjectPlain)
  })
})
