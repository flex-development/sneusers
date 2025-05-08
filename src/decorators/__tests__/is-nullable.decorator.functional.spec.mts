/**
 * @file Functional Tests - IsNullable
 * @module sneusers/decorators/tests/functional/IsNullable
 */

import TestSubject from '#decorators/is-nullable.decorator'
import { IsString, validateSync } from 'class-validator'

describe('functional:decorators/IsNullable', () => {
  it('should allow property value to be `null`', () => {
    // Arrange
    class Test {
      @IsString()
      @TestSubject()
      public readonly value: unknown = null
    }

    // Act
    const result = validateSync(new Test())

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })
})
