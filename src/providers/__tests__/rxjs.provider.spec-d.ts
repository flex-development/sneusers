/**
 * @file Type Tests - RxJSProvider
 * @module sneusers/providers/tests/unit-d/RxJSProvider
 */

import type { ValueProvider } from '@nestjs/common'
import type * as RxJS from 'rxjs'
import type TestSubject from '../rxjs.provider'

describe('unit-d:providers/RxJSProvider', () => {
  it('should equal type of ValueProvider<typeof RxJS>', () => {
    expectTypeOf<typeof TestSubject>().toEqualTypeOf<
      ValueProvider<typeof RxJS>
    >()
  })
})
