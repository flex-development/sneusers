import { ExceptionCode } from '@flex-development/exceptions/enums'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import { EmptyResultError } from 'sequelize'

/**
 * @file Fixtures - Exception
 * @module fixtures/Exception
 */

const message = 'Test exception'

const error = new EmptyResultError('User with id [4] not found')

const data: ExceptionDataDTO<EmptyResultError> = {
  errors: [error],
  message,
  options: { plain: true, rejectOnEmpty: true }
}

export default new Exception(
  ExceptionCode.NOT_FOUND,
  message,
  data,
  error.stack
)
