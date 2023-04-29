/**
 * @file Functional Tests - IsTimestamp
 * @module sneusers/decorators/tests/functional/IsTimestamp
 */

import type { Nullable } from '@flex-development/tutils'
import { validate } from 'class-validator'
import TestSubject from '../is-timestamp.decorator'

describe('functional:decorators/IsTimestamp', () => {
  it('should cause validation failure if validation fails', async () => {
    // Arrange
    class TestModel {
      @TestSubject()
      public readonly updated_at: Nullable<number> = null
    }

    // Act
    const result = await validate(new TestModel())

    // Expect
    expect(result).to.be.an('array').that.is.not.empty
    expect(result).toMatchSnapshot()
  })

  it('should not cause validation failure if validation passes', async () => {
    // Arrange
    class TestModel {
      @TestSubject()
      public readonly created_at: number = Date.now()
    }

    // Act + Expect
    expect(await validate(new TestModel())).to.be.an('array').that.is.empty
  })
})
