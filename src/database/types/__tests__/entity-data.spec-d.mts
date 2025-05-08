/**
 * @file Type Tests - EntityData
 * @module sneusers/database/types/tests/unit-d/EntityData
 */

import type TestSubject from '#database/types/entity-data'
import type { IDocument } from '@flex-development/sneusers/database'
import type { Nilable } from '@flex-development/tutils'
import type { ObjectId } from 'bson'

describe('unit-d:database/types/EntityData', () => {
  it('should extend Omit<T, "_id">', () => {
    expectTypeOf<TestSubject>().toExtend<Omit<IDocument, '_id'>>()
  })

  it('should match [_id?: ObjectId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_id')
      .toEqualTypeOf<Nilable<ObjectId>>()
  })
})
