/**
 * @file Type Tests - ExceptionInfo
 * @module sneusers/errors/interfaces/tests/unit-d/ExceptionInfo
 */

import type TestSubject from '#errors/interfaces/exception-info'
import type {
  ExceptionCode,
  ExceptionId,
  Reason
} from '@flex-development/sneusers/errors'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:errors/interfaces/ExceptionInfo', () => {
  it('should match [code: ExceptionCode | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('code')
      .toEqualTypeOf<ExceptionCode>()
  })

  it('should match [id: ExceptionId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('id')
      .toEqualTypeOf<ExceptionId>()
  })

  it('should match [message: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('message')
      .toEqualTypeOf<string>()
  })

  it('should match [reason?: Reason | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('reason')
      .toEqualTypeOf<Nilable<Reason>>()
  })
})
