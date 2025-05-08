/**
 * @file Errors - ValidationFailure
 * @module sneusers/errors/ValidationFailure
 */

import Reason from '#errors/models/base.reason'
import type { ValidationConstraints } from '@flex-development/sneusers/errors'
import type { JsonObject, JsonValue } from '@flex-development/sneusers/types'
import { fallback, shake } from '@flex-development/tutils'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import type { ValidationError } from 'class-validator'
import { ok } from 'devlop'

/**
 * The reason for a validation exception.
 *
 * @class
 * @extends {Reason}
 */
@ApiSchema()
class ValidationFailure extends Reason {
  /**
   * Map where each key is the name of a validation constraint and each value is
   * an error message.
   *
   * @todo document constraint names (?)
   *
   * @public
   * @instance
   * @member {ValidationConstraints} constraints
   */
  @ApiProperty({
    additionalProperties: { type: 'string' },
    description: 'violated validation constraints',
    type: 'object'
  })
  public constraints: ValidationConstraints

  /**
   * The name of the property that caused the validation failure.
   *
   * @public
   * @instance
   * @member {string} property
   */
  @ApiProperty({
    description: 'the name of the property that caused the validation failure',
    type: 'string'
  })
  public property: string

  /**
   * The property value that caused the validation failure.
   *
   * @public
   * @instance
   * @member {JsonValue | undefined} value
   */
  @ApiProperty({
    description: 'the property value that caused the validation failure',
    oneOf: [
      { type: 'array' },
      { type: 'boolean' },
      { type: 'null' },
      { type: 'number' },
      { type: 'object' },
      { type: 'string' }
    ],
    required: false
  })
  public value?: JsonValue | undefined

  /**
   * Create a validation exception info object.
   *
   * @param {ValidationError} info
   *  The validation error
   */
  constructor(info: ValidationError) {
    super()

    ok('value' in info, 'expected `info` to have property `value`')

    this.constraints = fallback(info.constraints, {})
    this.property = info.property
    this.value = info.value
  }

  /**
   * Get a JSON representation of the exception info.
   *
   * @public
   * @instance
   *
   * @return {JsonObject}
   *  JSON representation of `this` exception info
   */
  public toJSON(): JsonObject {
    return shake({
      property: this.property, // eslint-disable-next-line sort-keys
      constraints: this.constraints,
      value: this.value
    })
  }
}

export default ValidationFailure
