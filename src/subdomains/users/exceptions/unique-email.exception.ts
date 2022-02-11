import { ExceptionCode } from '@flex-development/exceptions/enums'
import { ObjectPlain } from '@flex-development/tutils'
import { Exception } from '@sneusers/exceptions'
import { UniqueConstraintError } from 'sequelize'
import type { IUserRaw } from '../interfaces'

/**
 * @file Users Subdomain Exceptions - EmailException
 * @module sneusers/subdomains/exceptions/EmailException
 */

class UniqueEmailException extends Exception<UniqueConstraintError> {
  /**
   * Instantiates a new `UniqueEmailException`.
   *
   * @param {string} email - Conflicting user email address
   * @param {UniqueConstraintError} error - {@link UniqueConstraintError} thrown
   * @param {ObjectPlain} [data={}] - Custom error data
   * @param {string} [data.message] - Custom error message. Overrides `message`
   */
  constructor(
    email: IUserRaw['email'],
    error: UniqueConstraintError,
    data: ObjectPlain = {}
  ) {
    super(ExceptionCode.CONFLICT)

    if (!data.message) {
      data.message = `User with email [${email}] already exists`
    }

    Object.assign(this, Exception.fromSequelizeError(error, data))
    Object.assign(this, { errors: error.errors })
  }
}

export default UniqueEmailException
