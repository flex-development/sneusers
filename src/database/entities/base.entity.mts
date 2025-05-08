/**
 * @file Entities - Entity
 * @module sneusers/database/entities/Entity
 */

import IsTimestamp from '#database/decorators/is-timestamp.decorator'
import IsNullable from '#decorators/is-nullable.decorator'
import type { EntityData, IDocument } from '@flex-development/sneusers/database'
import { ValidationException } from '@flex-development/sneusers/errors'
import { AggregateRoot, type IEvent } from '@nestjs/cqrs'
import { ObjectId } from 'bson'
import {
  Expose,
  instanceToPlain,
  Transform,
  Type,
  type ClassTransformOptions
} from 'class-transformer'
import {
  IsInstance,
  validateSync as validate,
  type ValidationError
} from 'class-validator'
import { ok } from 'devlop'

/**
 * Database entity model.
 *
 * @template {IDocument} [T=IDocument]
 *  Database record schema
 * @template {IEvent} [E=IEvent]
 *  Domain event base
 *
 * @class
 * @extends {AggregateRoot<E>}
 */
class Entity<
  T extends IDocument = IDocument,
  E extends IEvent = IEvent
> extends AggregateRoot<E> {
  /**
   * @private
   * @readonly
   * @instance
   * @member {T} $
   */
  declare private readonly $: T

  /**
   * Unique identifier for the entity.
   *
   * @public
   * @instance
   * @member {ObjectId} _id
   */
  @IsInstance(ObjectId)
  @Expose()
  @Type(() => ObjectId)
  @Transform(params => (params.obj as Entity)._id)
  public _id!: ObjectId

  /**
   * Unix timestamp indicating when entity was created.
   *
   * @public
   * @instance
   * @member {number} created_at
   */
  @IsTimestamp()
  public created_at: number

  /**
   * Unix timestamp indicating when entity was last modified.
   *
   * @public
   * @instance
   * @member {number | null} updated_at
   */
  @IsTimestamp()
  @IsNullable()
  public updated_at: number | null

  /**
   * Create a new entity.
   *
   * @param {EntityData<T> | T} props
   *  Existing database record or entity data transfer object
   */
  constructor(props: EntityData<T> | T) {
    super()

    this._id = props._id ?? new ObjectId()
    this.created_at = props.created_at
    this.updated_at = props.updated_at

    this.autoCommit = false
  }

  /**
   * Get the unique identifier for the entity.
   *
   * > 👉 **Note**: This is a JSON-friendly representation of {@linkcode _id}.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Unique identifier
   */
  public get uid(): string {
    return String(this._id)
  }

  /**
   * Get the entity as a persistable database record.
   *
   * > 👉 **Note**: The `class-transformer` package will need to be replaced.
   * > The repository does not seem maintained, and quite a few issues have been
   * > filed without any reply from the maintainer. One of these issues is that
   * > class instances are broken during transformation. This means `instanceof`
   * > checks do not work properly and any values that should be a class
   * > instances (e.g. {@linkcode _id}), are not.
   *
   * @public
   * @instance
   *
   * @param {ClassTransformOptions | null | undefined} [options]
   *  Transform options
   * @return {T}
   *  Database record object
   */
  public serialize(options?: ClassTransformOptions | null | undefined): T {
    return Object.assign(instanceToPlain(this, { ...options }) as T, {
      _id: this._id
    })
  }

  /**
   * Validate the entity.
   *
   * @public
   * @instance
   *
   * @return {this}
   *  `this` entity
   * @throws {ValidationException}
   */
  public validate(): this {
    /**
     * Validation errors.
     *
     * @const {ValidationError[]} errors
     */
    const errors: ValidationError[] = validate(this, {
      dismissDefaultMessages: false,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      skipMissingProperties: false,
      stopAtFirstError: true,
      validationError: { target: false, value: true },
      whitelist: false
    })

    if (errors.length) {
      ok(errors[0], 'expected `errors[0]`')
      throw new ValidationException(errors[0])
    }

    return this
  }
}

export default Entity
