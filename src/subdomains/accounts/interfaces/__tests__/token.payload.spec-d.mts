/**
 * @file Type Tests - TokenPayload
 * @module sneusers/accounts/interfaces/tests/unit-d/TokenPayload
 */

import type TestSubject from '#accounts/interfaces/token.payload'
import type { Account } from '@flex-development/sneusers/accounts'
import type { JsonObject } from '@flex-development/sneusers/types'

describe('unit-d:accounts/interfaces/TokenPayload', () => {
  it('should extend JsonObject', () => {
    expectTypeOf<TestSubject>().toExtend<JsonObject>()
  })

  it('should match [aud: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('aud').toEqualTypeOf<string>()
  })

  it('should match [email: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('email').toEqualTypeOf<string>()
  })

  it('should match [exp: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('exp').toEqualTypeOf<number>()
  })

  it('should match [iat: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('iat').toEqualTypeOf<number>()
  })

  it('should match [iss: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('iss').toEqualTypeOf<string>()
  })

  it('should match [role: Account["role"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('role')
      .toEqualTypeOf<Account['role']>()
  })

  it('should match [sub: Account["uid"]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sub')
      .toEqualTypeOf<Account['uid']>()
  })
})
