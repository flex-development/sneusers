/**
 * @file Providers - Repository
 * @module sneusers/database/providers/Repository
 */

import type { DatabaseRecord, Entity,
  Mapper } from '@flex-development/sneusers/database'
import type { ObjectId } from 'bson'

/**
 * Database repository model.
 *
 * @template {Entity} [T=Entity]
 *  Database entity
 *
 * @class
 */
class Repository<T extends Entity = Entity> {
  /**
   * Database record store.
   *
   * @protected
   * @readonly
   * @member {Map<string, DatabaseRecord<T>>} store
   */
  protected readonly store: Map<string, DatabaseRecord<T>>

  /**
   * Create a new repository.
   *
   * @param {Mapper<T>} mapper
   *  Data mapper
   */
  constructor(protected readonly mapper: Mapper<T>) {
    this.mapper = mapper
    this.store = new Map()
  }

  /**
   * Get a list of entities.
   *
   * @public
   * @instance
   *
   * @return {T[]}
   *  List of entities
   */
  public get entities(): T[] {
    return this.records.map(this.mapper.toDomain.bind(this.mapper))
  }

  /**
   * Get a list of database records.
   *
   * @public
   * @instance
   *
   * @return {DatabaseRecord<T>[]}
   *  List of database records
   */
  public get records(): DatabaseRecord<T>[] {
    return [...this.store.values()]
  }

  /**
   * Add a new record.
   *
   * Fails if `entity` validation fails.
   *
   * @public
   * @instance
   * @async
   *
   * @param {T} entity
   *  The entity representing the record to insert
   * @return {Promise<ObjectId>}
   *  The object id of the inserted record
   */
  public async insert(entity: T): Promise<ObjectId> {
    return new Promise(resolve => {
      entity.validate()
      this.store.set(entity.uid, this.mapper.toPersistence(entity))
      return void resolve(entity._id)
    })
  }
}

export default Repository
