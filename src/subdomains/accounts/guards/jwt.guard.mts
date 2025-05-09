/**
 * @file Guards - JwtGuard
 * @module sneusers/accounts/guards/Jwt
 */

import AuthStrategy from '#enums/auth-strategy'
import { Injectable } from '@nestjs/common'
import { AuthGuard, type IAuthGuard } from '@nestjs/passport'

/**
 * JWT authentication guard.
 *
 * @class
 * @implements {IAuthGuard}
 */
@Injectable()
class JwtGuard extends AuthGuard(AuthStrategy.JWT) implements IAuthGuard {}

export default JwtGuard
