import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { PaginatedDTO } from '@sneusers/dtos'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Entity } from '../entities'
import type { OutputEntity, StreamEntity } from '../types'

/**
 * @file DatabaseModule Interceptors - EntitySerializer
 * @module sneusers/modules/db/interceptors/EntitySerializer
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
  E extends Entity = Entity,
  T extends StreamEntity<E> = StreamEntity<E>,
  R extends OutputEntity<E> = OutputEntity<E>
> implements NestInterceptor<T, R>
{
  /**
   * Data mapper for {@link Entity} instances.
   *
   * Each instance will be converted into a JSON object.
   *
   * @see {@link ResBodyEntity}
   *
   * @param {ExecutionContext} context - Request pipeline details pipeline
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
        ...(entity instanceof Entity ? entity.toJSON() : entity),
        id: entity.id
      }))

      return payload as unknown as R
    }

    if (payload instanceof Entity) {
      return { ...payload.toJSON(), id: payload.id }
    }

    return (payload.toJSON ? payload.toJSON() : payload) as unknown as R
  }
}

export default EntitySerializer
