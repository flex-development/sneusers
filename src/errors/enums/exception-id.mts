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
  EMAIL_CONFLICT = 'accounts/email-conflict',
  INTERNAL_SERVER_ERROR = 'sneusers/internal-error',
  INVALID_CREDENTIAL = 'accounts/invalid-credential',
  VALIDATION_FAILURE = 'sneusers/validation-failure'
}

export default ExceptionId
