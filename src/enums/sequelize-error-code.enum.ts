import { ExceptionCode } from '@flex-development/exceptions/enums'

/**
 * @file Enums - SequelizeErrorCode
 * @module sneusers/enums/SequelizeErrorCode
 */

/**
 * `SequelizeError` error names mapped to HTTP error status codes.
 *
 * @see https://sequelize.org/v7/identifiers.html#errors
 *
 * @enum {ExceptionCode}
 */
enum SequelizeErrorCode {
  SequelizeAccessDeniedError = ExceptionCode.FORBIDDEN,
  SequelizeAggregateError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeAssociationError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeAsyncQueueError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeBaseError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeBulkRecordError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeConnectionAcquireTimeoutError = ExceptionCode.REQUEST_TIMEOUT,
  SequelizeConnectionError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeConnectionRefusedError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeConnectionTimedOutError = ExceptionCode.REQUEST_TIMEOUT,
  SequelizeDatabaseError = ExceptionCode.FAILED_DEPENDENCY,
  SequelizeEagerLoadingError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeEmptyResultError = ExceptionCode.NOT_FOUND,
  SequelizeExclusionConstraintError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeForeignKeyConstraintError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeHostNotFoundError = ExceptionCode.NOT_FOUND,
  SequelizeHostNotReachableError = ExceptionCode.SERVICE_UNAVAILABLE,
  SequelizeInstanceError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeInvalidConnectionError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeOptimisticLockError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeQueryError = ExceptionCode.BAD_REQUEST,
  SequelizeScopeError = ExceptionCode.INTERNAL_SERVER_ERROR,
  SequelizeTimeoutError = ExceptionCode.REQUEST_TIMEOUT,
  SequelizeUniqueConstraintError = ExceptionCode.CONFLICT,
  SequelizeUnknownConstraintError = ExceptionCode.EXPECTATION_FAILED,
  SequelizeValidationError = ExceptionCode.BAD_REQUEST
}

export default SequelizeErrorCode
