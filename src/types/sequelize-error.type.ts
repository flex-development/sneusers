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
 * @file Type Definitions - SequelizeError
 * @module sneusers/types/SequelizeError
 */

/**
 * Errors thrown by [Sequelize][1].
 *
 * [1]: https://sequelize.org/v7/identifiers.html#errors
 */
type SequelizeError =
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

export default SequelizeError
