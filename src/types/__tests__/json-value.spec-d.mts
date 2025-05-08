/**
 * @file Type Tests - JsonValue
 * @module sneusers/types/tests/unit-d/JsonValue
 */

import type TestSubject from '#types/json-value'
import type {
  JsonArray,
  JsonObject,
  JsonPrimitive
} from '@flex-development/sneusers/types'

describe('unit-d:types/JsonValue', () => {
  it('should extract JsonArray', () => {
    expectTypeOf<TestSubject>().extract<JsonArray>().not.toBeNever()
  })

  it('should extract JsonObject', () => {
    expectTypeOf<TestSubject>().extract<JsonObject>().not.toBeNever()
  })

  it('should extract JsonPrimitive', () => {
    expectTypeOf<TestSubject>().extract<JsonPrimitive>().not.toBeNever()
  })
})
