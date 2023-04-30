/**
 * @file Type Tests - Repository
 * @module sneusers/models/tests/unit-d/Repository
 */

import type { IEntity } from '#src/interfaces'
import type { MongoEntityRepository } from '@mikro-orm/mongodb'
import type TestSubject from '../repository.model'

describe('unit-d:models/Repository', () => {
  it('should extend MongoEntityRepository<T>', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<MongoEntityRepository<IEntity>>()
  })
})
