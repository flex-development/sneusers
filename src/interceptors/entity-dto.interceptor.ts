import type { OneOrMany } from '@flex-development/tutils'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { EntityDTO } from '@sneusers/dtos'
import { BaseEntity } from '@sneusers/entities'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Users Subdomain Interceptors - EntityDTOInterceptor
 * @module sneusers/subdomains/users/interceptors/EntityDTOInterceptor
 */

/**
 * @template E - Entity (dao) class type
 * @template R - Controller payload type(s)
 * @template T - Pre-intercepted response type(s)
 */
@Injectable()
class EntityDTOInterceptor<
  E extends BaseEntity = BaseEntity,
  R extends EntityDTO<E['_attributes']> = EntityDTO<E['_attributes']>,
  T extends OneOrMany<E> = OneOrMany<E>
> implements NestInterceptor<T, R>
{
  /**
   * Data mapper for {@link BaseEntity} instances.
   *
   * Each instance will be converted into a serializable JSON object.
   *
   * @see {@link EntityDTO}
   *
   * @param {ExecutionContext} context - Object containing methods for accessing
   * the route handler and the class about to be invoked
   * @param {CallHandler<T>} next - Object providing access to an
   * {@link Observable} representing the response stream from the route handler
   * @return {Observable<R>} {@link Observable} containing {@link Payload}
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    /**
     * Converts a single {@link BaseEntity} instance or array of instances into
     * {@link EntityDTO} objects.
     *
     * @param {T} value - Single entity or array of entities
     * @return {R} `EntityDTO` object(s)
     */
    const project = (value: T): R => {
      const array = Array.isArray(value)
      return (array ? value.map(e => e.toJSON()) : value.toJSON()) as R
    }

    return next.handle().pipe(map(project))
  }
}

export default EntityDTOInterceptor
