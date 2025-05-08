/**
 * @file Interfaces - ValidationConstraints
 * @module sneusers/errors/interfaces/ValidationConstraints
 */

/**
 * Map where each key is the name of a validation constraint and each value is
 * an error message.
 */
interface ValidationConstraints {
  [constraint: string]: string
}

export type { ValidationConstraints as default }
