/**
 * @file Type Tests - AccountDocument
 * @module sneusers/accounts/interfaces/tests/unit-d/AccountDocument
 */

import type TestSubject from '#accounts/interfaces/account.document'
import type { Role } from '@flex-development/sneusers/accounts'
import type { IDocument } from '@flex-development/sneusers/database'

describe('unit-d:accounts/interfaces/AccountDocument', () => {
  it('should extend IDocument', () => {
    expectTypeOf<TestSubject>().toExtend<IDocument>()
  })

  it('should match [email: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('email').toEqualTypeOf<string>()
  })

  it('should match [password: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('password')
      .toEqualTypeOf<string>()
  })

  it('should match [role: Role]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('role').toEqualTypeOf<Role>()
  })
})
