import { ExceptionDataDTO } from '@sneusers/dtos'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { EmptyResultError } from 'sequelize'

/**
 * @file Global Test Fixture - Exception
 * @module tests/fixtures/Exception
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
