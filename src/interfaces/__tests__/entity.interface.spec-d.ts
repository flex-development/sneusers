/**
 * @file Type Tests - IEntity
 * @module sneusers/interfaces/tests/unit-d/IEntity
 */

import type { Nullable } from '@flex-development/tutils'
import type { ObjectId } from '@mikro-orm/mongodb'
import type TestSubject from '../entity.interface'

describe('unit-d:interfaces/IEntity', () => {
  it('should match [_id: ObjectId]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('_id').toEqualTypeOf<ObjectId>()
  })

  it('should match [created_at: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('created_at').toBeNumber()
  })

  it('should match [updated_at: Nullable<number>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('updated_at')
      .toEqualTypeOf<Nullable<number>>()
  })
})
