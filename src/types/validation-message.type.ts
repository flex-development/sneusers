import type { ValidationArguments } from 'class-validator'

/**
 * @file Type Definitions - ValidationMessage
 * @module sneusers/types/ValidationMessage
 */

/**
 * Error message to be used on validation fails.
 */
type ValidationMessage = string | ((args: ValidationArguments) => string)

export default ValidationMessage
