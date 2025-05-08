/**
 * @file Type Tests - DatabaseRecord
 * @module sneusers/types/tests/unit-d/DatabaseRecord
 */

import type TestSubject from '#database/types/database-record'
import type { IDocument } from '@flex-development/sneusers/database'

describe('unit-d:types/DatabaseRecord', () => {
  it('should equal T["$"]', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<IDocument>()
  })
})
