import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { PaginatedDTO } from '@sneusers/dtos'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import omit from 'lodash.omit'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Users Subdomain Interceptors - UserInterceptor
 * @module sneusers/subdomains/users/interceptors/UserInterceptor
 */

type Stream = Partial<IUser> | PaginatedDTO<Partial<IUser>>

/**
 * @template T - Pre-intercepted response type(s)
 * @template R - Interceptor output type(s)
 */
@Injectable()
class UserInterceptor<
  T extends Stream = Stream,
  R extends UserDTO | PaginatedDTO<UserDTO> = UserDTO | PaginatedDTO<UserDTO>
> implements NestInterceptor<T, R>
{
  /**
   * Removes sensitive data from {@link IUser} objects.
   *
   * @see {@link IUser}
   *
   * @param {ExecutionContext} context - Object containing methods for accessing
   * the route handler and the class about to be invoked
   * @param {CallHandler<T>} next - Object providing access to an
   * {@link Observable} representing the response stream from the route handler
   * @return {Observable<R>} {@link Observable} containing {@link Payload}
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    return next.handle().pipe(map(this.strip))
  }

  /**
   * Removes the following properties from {@link IUser} objects:
   *
   * - `email_verified`
   * - `password`
   *
   * @param {T} payload - User object or paginated response
   * @return {R} Payload without listed properties
   */
  strip(payload: T): R {
    const STRIP = ['email_verified', 'password']

    if (payload instanceof PaginatedDTO) {
      payload.results = payload.results.map(user => omit(user, STRIP))
      return payload as unknown as R
    }

    return omit(payload, STRIP) as unknown as R
  }
}

export default UserInterceptor
