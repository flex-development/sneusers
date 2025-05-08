/**
 * @file Type Tests - JsonPrimitive
 * @module sneusers/types/tests/unit-d/JsonPrimitive
 */

import type TestSubject from '#types/json-primitive'

describe('unit-d:types/JsonPrimitive', () => {
  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })

  it('should extract number', () => {
    expectTypeOf<TestSubject>().extract<number>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })

  it('should extract null', () => {
    expectTypeOf<TestSubject>().extract<null>().not.toBeNever()
  })
})
