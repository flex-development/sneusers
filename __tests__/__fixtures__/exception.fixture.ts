import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { EmptyResultError } from 'sequelize'

/**
 * @file Global Test Fixture - Exception
 * @module tests/fixtures/Exception
 */

const message = 'User with id [4] not found'

export default new Exception(ExceptionCode.NOT_FOUND, 'Test exception', {
  errors: [new EmptyResultError(message)],
  message,
  options: { plain: true, rejectOnEmpty: true }
})
