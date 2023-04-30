/**
 * @file Functional Tests - IsOptional
 * @module sneusers/decorators/tests/functional/IsOptional
 */

import { IsString, validate } from 'class-validator'
import TestSubject from '../is-optional.decorator'

describe('functional:decorators/IsOptional', () => {
  it('should ignore property validators if value is undefined', async () => {
    // Arrange
    class TestModel {
      @IsString()
      @TestSubject()
      public readonly $property: string | undefined = undefined
    }

    // Act + Expect
    expect(await validate(new TestModel())).to.be.an('array').that.is.empty
  })
})
