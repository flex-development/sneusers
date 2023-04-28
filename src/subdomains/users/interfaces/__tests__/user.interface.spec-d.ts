/**
 * @file Type Tests - IUser
 * @module sneusers/subdomains/users/tests/unit-d/IUser
 */

import type { IEntity } from '#src/interfaces'
import type { Nullable } from '@flex-development/tutils'
import type TestSubject from '../user.interface'

describe('unit-d:subdomains/users/interfaces/IUser', () => {
  it('should extend IEntity', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<IEntity>()
  })

  it('should match [display_name: Nullable<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('display_name')
      .toEqualTypeOf<Nullable<string>>()
  })

  it('should match [email: Lowercase<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('email')
      .toEqualTypeOf<Lowercase<string>>()
  })
})
