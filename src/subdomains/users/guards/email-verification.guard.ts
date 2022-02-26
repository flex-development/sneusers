import { ExceptionCode } from '@flex-development/exceptions/enums'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import type { UserRequest } from '../interfaces'

/**
 * @file Users Subdomain Guards - EmailVerificationGuard
 * @module sneusers/subdomains/users/guards/EmailVerificationGuard
 */

@Injectable()
class EmailVerificationGuard implements CanActivate {
  /**
   * Checks if a user has verified their email address.
   *
   * @param {ExecutionContext} context - Request pipeline details pipeline
   * @return {true} `true` if user verified email address
   * @throws {Exception}
   */
  canActivate(context: ExecutionContext): true {
    const req = context.switchToHttp().getRequest<UserRequest>()
    const user = req.user || {}

    if (!user?.email_verified) {
      throw new Exception(ExceptionCode.UNAUTHORIZED, 'Email not verified', {
        errors: [{ email: user?.email ?? null }],
        user: { id: user?.id ?? null }
      })
    }

    return true
  }
}

export default EmailVerificationGuard
