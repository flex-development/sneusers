import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { PaginatedDTO } from '@sneusers/dtos'
import type { ILoginDTO } from '@sneusers/subdomains/auth/interfaces'
import { User } from '@sneusers/subdomains/users/entities'
import type { IUser, UserRequest } from '@sneusers/subdomains/users/interfaces'
import type { OutputUser, StreamUser } from '@sneusers/subdomains/users/types'
import omit from 'lodash.omit'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Users Subdomain Interceptors - UserInterceptor
 * @module sneusers/subdomains/users/interceptors/UserInterceptor
 */

/**
 * Intercepts responses including {@link User} data.
 *
 * The `EntitySerializer` should be used **before** this interceptor.
 *
 * @template T - Pre-intercepted response type(s)
 * @template R - Interceptor output type(s)
 *
 * @implements {NestInterceptor<T, R>}
 */
@Injectable()
class UserInterceptor<
  T extends StreamUser = StreamUser,
  R extends OutputUser = OutputUser
> implements NestInterceptor<T, R>
{
  /**
   * Removes sensitive data from {@link IUser} objects.
   *
   * If an authenticated user isn't detected, the following properties will be
   * removed from the payload:
   *
   * - `email_verified`
   * - `password`
   *
   * If an authenticated user is found, the following properties will be removed
   * from the payload:
   *
   * - `password`
   *
   * @see {@link IUser}
   *
   * @param {ExecutionContext} context - Details about current request pipeline
   * @param {CallHandler<T>} next - Object providing access to response stream
   * @return {Observable<R>} {@link Observable} containing {@link Payload}
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    const req = context.switchToHttp().getRequest<UserRequest>()
    return next.handle().pipe(map(value => this.strip(value, req.user)))
  }

  /**
   * Removes sensitive data from `payload`.
   *
   * If `user` is defined, the following properties will be removed:
   *
   * - `password`
   *
   * If `user` is not defined, the following properties will be removed:
   *
   * - `email_verified`
   * - `password`
   *
   * @param {T} payload - User object or paginated response
   * @param {User} [user] - Authenticated user, if any
   * @return {R} Payload without listed properties
   */
  strip(payload: T, user?: User): R {
    if ((payload as ILoginDTO).access_token) return payload as unknown as R

    const STRIP: (keyof IUser)[] = ['password']
    const STRIP_PAGINATED: (keyof IUser)[] = [...STRIP, 'password']

    if (payload instanceof PaginatedDTO) {
      payload.results = payload.results.map(user => omit(user, STRIP_PAGINATED))
      return payload as unknown as R
    }

    if (!user) STRIP.push('email_verified')

    return omit(payload, STRIP) as unknown as R
  }
}

export default UserInterceptor
