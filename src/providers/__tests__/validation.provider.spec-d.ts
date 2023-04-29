/**
 * @file Type Tests - ValidationProvider
 * @module sneusers/providers/tests/unit-d/ValidationProvider
 */

import type { ValidationPipe, ValueProvider } from '@nestjs/common'
import type TestSubject from '../validation.provider'

describe('unit-d:providers/ValidationProvider', () => {
  it('should equal type of ValueProvider<ValidationPipe>', () => {
    expectTypeOf<typeof TestSubject>().toEqualTypeOf<
      ValueProvider<ValidationPipe>
    >()
  })
})
