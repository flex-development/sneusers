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
 * @file Interceptors - EntitySerializer
 * @module sneusers/interceptors/EntitySerializer
 */

/**
 * @template E - Entity (dao) class type
 * @template R - Controller payload type(s)
 * @template T - Pre-intercepted response type(s)
 */
@Injectable()
class EntitySerializer<
  E extends BaseEntity = BaseEntity,
  R extends ResBodyEntity<E['_attributes']> = ResBodyEntity<E['_attributes']>,
  T extends OneOrMany<E> = OneOrMany<E>
> implements NestInterceptor<T, R>
{
  /**
   * Data mapper for {@link BaseEntity} instances.
   *
   * Each instance will be converted into a JSON object.
   *
   * @see {@link ResBodyEntity}
   *
   * @param {ExecutionContext} context - Object containing methods for accessing
   * the route handler and the class about to be invoked
   * @param {CallHandler<T>} next - Object providing access to an
   * {@link Observable} representing the response stream from the route handler
   * @return {Observable<R>} {@link Observable} containing {@link Payload}
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    return next.handle().pipe(map(this.serialize))
  }

  /**
   * Creates JSON representations of {@link BaseEntity} instances.
   *
   * @param {T} payload - Entity or array of entities to transform
   * @return {R} Serialized entity or array of serialized entities
   */
  serialize(payload: T): R {
    const json = (entity: E | Exclude<T, any[]>): Exclude<R, any[]> => {
      return entity instanceof BaseEntity ? entity.toJSON() : entity
    }

    if (Array.isArray(payload)) return payload.map(e => json(e)) as unknown as R
    return json(payload as Exclude<T, any[]>)
  }
}

export default EntitySerializer
