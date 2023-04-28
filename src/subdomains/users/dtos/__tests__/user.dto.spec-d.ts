/**
 * @file Type Tests - UserDTO
 * @module sneusers/subdomains/users/tests/unit-d/UserDTO
 */

import type { IUser } from '#src/subdomains/users/interfaces'
import type TestSubject from '../user.dto'

describe('unit-d:subdomains/users/dtos/UserDTO', () => {
  it('should extend Omit<Partial<IUser>, "email">', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Omit<Partial<IUser>, 'email'>>()
  })

  it('should match [email?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('email')
      .toEqualTypeOf<string | undefined>()
  })
})
