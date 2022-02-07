import type { ValidatorConstraint } from 'class-validator'

/**
 * @file Type Definitions - ValidatorConstraintOptions
 * @module sneusers/types/ValidatorConstraintOptions
 */

/**
 * Custom validation class options.
 *
 * @see https://github.com/typestack/class-validator#custom-validation-classes
 */
type ValidatorConstraintOptions = NonNullable<
  Parameters<typeof ValidatorConstraint>[0]
>

export default ValidatorConstraintOptions
