/**
 * @file Type Tests - HelmetOptionsProvider
 * @module sneusers/providers/tests/unit-d/HelmetOptionsProvider
 */

import type { ValueProvider } from '@nestjs/common'
import type { HelmetOptions } from 'helmet'
import type TestSubject from '../helmet-options.provider'

describe('unit-d:providers/HelmetOptionsProvider', () => {
  it('should equal type of ValueProvider<HelmetOptions>', () => {
    // Arrange
    type Expected = ValueProvider<HelmetOptions>

    // Expect
    expectTypeOf<typeof TestSubject>().toEqualTypeOf<Expected>()
  })
})
