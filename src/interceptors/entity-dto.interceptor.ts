import type { OneOrMany } from '@flex-development/tutils'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import type { ResBodyEntity } from '@sneusers/dtos'
import { BaseEntity } from '@sneusers/entities'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Interceptors - EntityDTOInterceptor
 * @module sneusers/interceptors/EntityDTOInterceptor
 */

/**
 * @template E - Entity (dao) class type
 * @template R - Controller payload type(s)
 * @template T - Pre-intercepted response type(s)
 */
@Injectable()
class EntityDTOInterceptor<
  E extends BaseEntity = BaseEntity,
  R extends ResBodyEntity<E['_attributes']> = ResBodyEntity<E['_attributes']>,
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
     * {@link EntityDTO}s.
     *
     * @param {T} value - Single entity or array of entities
     * @return {R} `EntityDTO`(s)
     */
    const project = (value: T): R => {
      if (Array.isArray(value)) {
        return value.map(e => (e instanceof BaseEntity ? e.toJSON() : e)) as R
      }

      return (value instanceof BaseEntity ? value.toJSON() : value) as R
    }

    return next.handle().pipe(map(project))
  }
}

export default EntityDTOInterceptor
