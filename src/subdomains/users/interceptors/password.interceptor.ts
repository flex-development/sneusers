import type { OneOrMany } from '@flex-development/tutils'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import omit from 'lodash.omit'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Users Subdomain Interceptors - PasswordInterceptor
 * @module sneusers/subdomains/users/interceptors/PasswordInterceptor
 */

type WithPassword = true

/**
 * @template T - Pre-intercepted response type(s)
 * @template R - Controller payload type(s)
 */
@Injectable()
class PasswordInterceptor<
  T extends OneOrMany<UserDTO<WithPassword>> = OneOrMany<UserDTO<WithPassword>>,
  R extends OneOrMany<UserDTO> = OneOrMany<UserDTO>
> implements NestInterceptor<T, R>
{
  /**
   * Removes the password property from {@link UserDTO}s.
   *
   * @see {@link UserDTO}
   *
   * @param {ExecutionContext} context - Object containing methods for accessing
   * the route handler and the class about to be invoked
   * @param {CallHandler<T>} next - Object providing access to an
   * {@link Observable} representing the response stream from the route handler
   * @return {Observable<R>} {@link Observable} containing {@link Payload}
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    /**
     * Removes the password property from a single {@link UserDTO} or each dto
     * in an array.
     *
     * @param {T} value - Single dto or array of dtos
     * @return {R} Passwordless `UserDTO`(s)
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
