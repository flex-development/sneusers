/**
 * @file Functional Tests - IsTimestamp
 * @module sneusers/database/decorators/tests/functional/IsTimestamp
 */

import TestSubject from '#database/decorators/is-timestamp.decorator'
import { validateSync } from 'class-validator'

describe('functional:database/decorators/IsTimestamp', () => {
  it.each<unknown>([
    -13,
    null
  ])('should fail if property value is not valid timestamp (%#)', value => {
    // Arrange
    class Test {
      @TestSubject()
      public readonly value: unknown = value
    }

    // Act
    const result = validateSync(new Test(), {
      validationError: {
        target: false,
        value: true
      }
    })

    // Expect
    expect(result).to.be.an('array').of.length(1)
    expect(result).toMatchSnapshot()
  })

  it('should pass if property value is valid timestamp', () => {
    // Arrange
    class Test {
      @TestSubject()
      public readonly value: unknown = Date.now()
    }

    // Act
    const result = validateSync(new Test())

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })
})
