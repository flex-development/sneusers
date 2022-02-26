import type {
  AccessDeniedError,
  AggregateError,
  AsyncQueueError,
  BaseError,
  ConnectionError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  DatabaseError,
  EmptyResultError,
  ExclusionConstraintError,
  ForeignKeyConstraintError,
  HostNotFoundError,
  HostNotReachableError,
  InvalidConnectionError,
  OptimisticLockError,
  SequelizeScopeError,
  TimeoutError,
  UniqueConstraintError,
  UnknownConstraintError,
  ValidationError
} from 'sequelize'

/**
 * @file DatabaseModule Type Definitions - SequelizeErrorType
 * @module sneusers/modules/db/types/SequelizeErrorType
 */

/**
 * Errors thrown by [Sequelize][1].
 *
 * [1]: https://sequelize.org/v7/identifiers.html#errors
 */
type SequelizeErrorType =
  | AccessDeniedError
  | AggregateError
  | AsyncQueueError
  | BaseError
  | ConnectionError
  | ConnectionRefusedError
  | ConnectionTimedOutError
  | DatabaseError
  | EmptyResultError
  | ExclusionConstraintError
  | ForeignKeyConstraintError
  | HostNotFoundError
  | HostNotReachableError
  | InvalidConnectionError
  | OptimisticLockError
  | SequelizeScopeError
  | TimeoutError
  | UniqueConstraintError
  | UnknownConstraintError
  | ValidationError

export default SequelizeErrorType
