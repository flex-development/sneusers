/**
 * @file Type Tests - ExceptionJson
 * @module sneusers/errors/interfaces/tests/unit-d/ExceptionJson
 */

import type TestSubject from '#errors/interfaces/exception-json'
import type {
  ExceptionCode,
  ExceptionId
} from '@flex-development/sneusers/errors'
import type { JsonObject } from '@flex-development/sneusers/types'
import type { Nullable } from '@flex-development/tutils'

describe('unit-d:errors/interfaces/ExceptionJson', () => {
  it('should extend JsonObject', () => {
    expectTypeOf<TestSubject>().toExtend<JsonObject>()
  })

  it('should match [code: ExceptionCode]', () => {
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

  it('should match [reason: JsonObject | null]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('reason')
      .toEqualTypeOf<Nullable<JsonObject>>()
  })
})
