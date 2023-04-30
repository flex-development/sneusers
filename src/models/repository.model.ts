/**
 * @file Data Models - Repository
 * @module sneusers/models/Repository
 */

import type { IEntity } from '#src/interfaces'
import { ValidationProvider } from '#src/providers'
import type { ObjectPlain, OneOrMany } from '@flex-development/tutils'
import { ValidationError, type EntityFactory } from '@mikro-orm/core'
import {
  MongoEntityRepository,
  type MongoEntityManager
} from '@mikro-orm/mongodb'
import * as validator from 'class-validator'
import { get } from 'radash'

/**
 * Generic database access model.
 *
 * @see {@linkcode IEntity}
 * @see {@linkcode MongoEntityRepository}
 *
 * @template T - Database entity type
 *
 * @class
 * @extends {MongoEntityRepository<T>}
 */
class Repository<T extends IEntity = IEntity> extends MongoEntityRepository<T> {
  /**
   * Returns the underlying entity manager instance.
   *
   * @see {@linkcode MongoEntityManager}
   *
   * @protected
   *
   * @return {MongoEntityManager} Entity manager instance
   */
  protected override get em(): MongoEntityManager {
    return this.getEntityManager()
  }

  /**
   * Returns the entity factory used by the entity manager.
   *
   * @see {@linkcode EntityFactory}
   *
   * @protected
   *
   * @return {EntityFactory} Entity factory used by {@linkcode em}
   */
  protected get factory(): EntityFactory {
    return this.em.getEntityFactory()
  }

  /**
   * Creates a new instance of an entity and populates it with the given `data`.
   *
   * The entity constructor will be given parameters based on the defined
   * constructor of {@linkcode T}. If the constructor parameter matches a
   * property name, its value will be extracted from the given `data`.
   *
   * If no matching property exists, the entire `data` parameter will be passed.
   * Unless there is property named `data`, this means constructors can be
   * defined as `constructor(data: Partial<T>)` and `create` will pass `data`
   * into it.
   *
   * An explicit {@linkcode flush} operation is required to commit changes to
   * the database afterwards.
   *
   * @template Data - Data transfer object type
   *
   * @public
   * @override
   *
   * @param {Data} data - Data transfer object
   * @return {T} Entity instance
   */
  public override create<Data extends ObjectPlain>(data: Data): T {
    return this.factory.createEmbeddable<T>(this.entityName, data, {
      convertCustomTypes: true,
      newEntity: true
    })
  }

  /**
   * Instructs the entity manager to make an instance, or set of an instances,
   * managed and persistent.
   *
   * Entities will be entered into the database at or before transaction commit,
   * or as a result of the {@linkcode flush} operation.
   *
   * Throws if any entity fails validation.
   *
   * @public
   * @override
   *
   * @param {OneOrMany<T>} entities - Entities to mark for persistance
   * @return {MongoEntityManager} Entity manager instance
   */
  public override persist(entities: OneOrMany<T>): MongoEntityManager {
    for (const entity of [entities].flat() as T[]) {
      this.em.persist(this.validate(entity))
    }

    return this.em
  }

  /**
   * Instructs the entity manager to immediately persist an instance, or set of
   * an instances, flushing all not yet persisted changes to the database too.
   *
   * @public
   * @override
   * @async
   *
   * @param {OneOrMany<T>} entities - Entities to persist and flush
   * @return {Promise<void>} Nothing when complete
   */
  public override async persistAndFlush(entities: OneOrMany<T>): Promise<void> {
    await this.persist(entities).flush()
    return void entities
  }

  /**
   * Entity validator.
   *
   * @public
   *
   * @param {T} entity - Entity instance to validate
   * @return {T} Validated entity instance
   * @throws {ValidationError<T>}
   */
  public validate(entity: T): T {
    /**
     * Validation errors.
     *
     * @const {validator.ValidationError[]} errors
     */
    const errors: validator.ValidationError[] = validator.validateSync(
      entity,
      get(ValidationProvider.useValue, 'validatorOptions')!
    )

    // throw if validation errors were encountered
    if (errors.length > 0) {
      /**
       * Entity validation error message.
       *
       * @const {string} message
       */
      const message: string = 'Validation failed'

      /**
       * Entity validation error.
       *
       * @const {ValidationError<T>} error
       */
      const error: ValidationError<T> = new ValidationError<T>(message, entity)

      // assign errors to error.cause to access errors from exception filter
      error.cause = errors

      throw error
    }

    return entity
  }
}

export default Repository
