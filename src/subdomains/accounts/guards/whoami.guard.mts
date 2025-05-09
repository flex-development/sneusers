/**
 * @file Guards - WhoamiGuard
 * @module sneusers/accounts/guards/Whoami
 */

import JwtGuard from '#accounts/guards/jwt.guard'
import { Injectable, type ExecutionContext } from '@nestjs/common'
import type { IAuthGuard } from '@nestjs/passport'

/**
 * Optional JWT authentication guard.
 *
 * @class
 * @extends {JwtGuard}
 * @implements {IAuthGuard}
 */
@Injectable()
class WhoamiGuard extends JwtGuard implements IAuthGuard {
  /**
   * Authenticate a user using a JWT, and fail silently if the user cannot be
   * authenticated.
   *
   * @public
   * @instance
   * @override
   *
   * @param {ExecutionContext} context
   *  Details about the current request pipeline
   * @return {true}
   *  `true`
   */
  public override async canActivate(context: ExecutionContext): Promise<true> {
    try {
      return await super.canActivate(context) as true
    } catch {
      return true
    }
  }
}

export default WhoamiGuard
