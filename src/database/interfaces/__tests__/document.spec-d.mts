/**
 * @file Type Tests - IDocument
 * @module sneusers/database/interfaces/tests/unit-d/IDocument
 */

import type TestSubject from '#database/interfaces/document'
import type { Nullable } from '@flex-development/tutils'
import type { ObjectId } from 'bson'

describe('unit-d:database/interfaces/IDocument', () => {
  it('should match [_id: ObjectId]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('_id').toEqualTypeOf<ObjectId>()
  })

  it('should match [created_at: number]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('created_at')
      .toEqualTypeOf<number>()
  })

  it('should match [updated_at: number | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('updated_at')
      .toEqualTypeOf<Nullable<number>>()
  })
})
