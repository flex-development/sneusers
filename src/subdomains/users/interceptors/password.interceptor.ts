import type { OneOrMany } from '@flex-development/tutils'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import omit from 'lodash.omit'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Users Subdomain Interceptors - PasswordInterceptor
 * @module sneusers/subdomains/users/interceptors/PasswordInterceptor
 */

/**
 * @template T - Pre-intercepted response type(s)
 * @template R - Controller payload type(s)
 */
@Injectable()
class PasswordInterceptor<
  T extends OneOrMany<Partial<IUser>> = OneOrMany<Partial<IUser>>,
  R extends OneOrMany<UserDTO> = OneOrMany<UserDTO>
> implements NestInterceptor<T, R>
{
  /**
   * Removes the password property from {@link IUser} objects.
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
    /**
     * Removes the password property from a single {@link IUser} object or each
     * object in an array.
     *
     * @param {T} value - Single dto or array of dtos
     * @return {R} `UserDTO`(s)
     */
    const project = (value: T): R => {
      const array = Array.isArray(value)

      if (array) return value.map(user => omit(user, ['password'])) as R
      return omit(value, ['password']) as unknown as R
    }

    return next.handle().pipe(map(project))
  }
}

export default PasswordInterceptor
