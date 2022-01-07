/**
 * @file Enums - SequelizeErrorName
 * @module sneusers/enums/SequelizeErrorName
 */

/**
 * `SequelizeError` error names.
 *
 * @see https://sequelize.org/v7/identifiers.html#errors
 *
 * @enum {string}
 */
enum SequelizeErrorName {
  AccessDenied = 'SequelizeAccessDeniedError',
  Aggregate = 'SequelizeAggregateError',
  Association = 'SequelizeAssociationError',
  AsyncQueue = 'SequelizeAsyncQueueError',
  Base = 'SequelizeBaseError',
  BulkRecord = 'SequelizeBulkRecordError',
  Connection = 'SequelizeConnectionError',
  ConnectionAcquireTimeout = 'SequelizeConnectionAcquireTimeoutError',
  ConnectionRefused = 'SequelizeConnectionRefusedError',
  ConnectionTimedOut = 'SequelizeConnectionTimedOutError',
  Database = 'SequelizeDatabaseError',
  EagerLoading = 'SequelizeEagerLoadingError',
  EmptyResult = 'SequelizeEmptyResultError',
  ExclusionConstraint = 'SequelizeExclusionConstraintError',
  ForeignKeyConstraint = 'SequelizeForeignKeyConstraintError',
  HostNotFound = 'SequelizeHostNotFoundError',
  HostNotReachable = 'SequelizeHostNotReachableError',
  Instance = 'SequelizeInstanceError',
  InvalidConnection = 'SequelizeInvalidConnectionError',
  OptimisticLock = 'SequelizeHostNotReachableError',
  Query = 'SequelizeQueryError',
  Scope = 'SequelizeScopeError',
  Timeout = 'SequelizeTimeoutError',
  UniqueConstraint = 'SequelizeUniqueConstraintError',
  UnknownConstraint = 'SequelizeUnknownConstraintError',
  Validation = 'SequelizeValidationError'
}

export default SequelizeErrorName
