import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type { UserRequest } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Users Subdomain Guards - EmailVerificationGuard
 * @module sneusers/subdomains/users/guards/EmailVerificationGuard
 */

@Injectable()
class EmailVerificationGuard implements CanActivate {
  /**
   * Checks if a user has verified their email address.
   *
   * @param {ExecutionContext} context - Details about current request pipeline
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
