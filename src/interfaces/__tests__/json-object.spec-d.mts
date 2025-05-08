/**
 * @file Type Tests - JsonObject
 * @module sneusers/interfaces/tests/unit-d/JsonObject
 */

import type TestSubject from '#interfaces/json-object'
import type { JsonValue } from '@flex-development/sneusers/types'

describe('unit-d:interfaces/JsonObject', () => {
  it('should match Record<string, JsonValue>', () => {
    expectTypeOf<TestSubject>().toExtend<Record<string, JsonValue>>()
  })

  describe('JsonObject[number]', () => {
    it('should not allow undefined', () => {
      expectTypeOf<TestSubject[number]>().extract<undefined>().toBeNever()
    })
  })

  describe('JsonObject[string]', () => {
    it('should not allow undefined', () => {
      expectTypeOf<TestSubject[string]>().extract<undefined>().toBeNever()
    })
  })
})
