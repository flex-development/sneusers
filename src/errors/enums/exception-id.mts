/**
 * @file Errors - ExceptionId
 * @module sneusers/errors/ExceptionId
 */

/**
 * Unique identifiers representing exceptions.
 *
 * @enum {Lowercase<string>}
 */
enum ExceptionId {
  INTERNAL_SERVER_ERROR = 'sneusers/internal-error',
  VALIDATION_FAILURE = 'sneusers/validation-failure'
}

export default ExceptionId
