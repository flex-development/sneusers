import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { PaginatedDTO } from '@sneusers/dtos'
import { BaseEntity } from '@sneusers/entities'
import type { OutputEntity, StreamEntity } from '@sneusers/types'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * @file Interceptors - EntitySerializer
 * @module sneusers/interceptors/EntitySerializer
 */

/**
 * @template E - Entity (dao) class type
 * @template T - Pre-intercepted response type(s)
 * @template R - Interceptor output type(s)
 *
 * @implements {NestInterceptor<T, R>}
 */
@Injectable()
class EntitySerializer<
  E extends BaseEntity = BaseEntity,
  T extends StreamEntity<E> = StreamEntity<E>,
  R extends OutputEntity<E> = OutputEntity<E>
> implements NestInterceptor<T, R>
{
  /**
   * Data mapper for {@link BaseEntity} instances.
   *
   * Each instance will be converted into a JSON object.
   *
   * @see {@link ResBodyEntity}
   *
   * @param {ExecutionContext} context - Details about current request pipeline
   * @param {CallHandler<T>} next - Object providing access to response stream
   * @return {Observable<R>} `Observable` containing response payload
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    return next.handle().pipe(map(this.serialize))
  }

  /**
   * Creates a JSON representations of `payload`.
   *
   * @param {T} payload - Pre-intercepted response payload
   * @return {R} Serialized payload
   */
  serialize(payload: T): R {
    if (payload instanceof PaginatedDTO) {
      payload.results = payload.results.map(entity => ({
        ...(entity instanceof BaseEntity ? entity.toJSON() : entity),
        id: entity.id
      }))

      return payload as unknown as R
    }

    if (payload instanceof BaseEntity) {
      return { ...payload.toJSON(), id: payload.id }
    }

    return (payload.toJSON ? payload.toJSON() : payload) as unknown as R
  }
}

export default EntitySerializer
