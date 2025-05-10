/**
 * @file Providers - Repository
 * @module sneusers/database/providers/Repository
 */

import type {
  DatabaseRecord,
  Entity,
  Mapper
} from '@flex-development/sneusers/database'
import type { ObjectId } from 'bson'
import { ok } from 'devlop'

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
   * Delete a record by `uid`.
   *
   * @public
   * @instance
   * @async
   *
   * @param {ObjectId | string} uid
   *  The id of the record to remove
   * @return {Promise<ObjectId>}
   *  An entity representing the deleted record
   */
  public async delete(uid: ObjectId | string): Promise<T> {
    /**
     * The entity to remove.
     *
     * @const {T | null} entity
     */
    const entity: T | null = await this.findById(uid)

    ok(entity, 'expected `entity` to remove')
    this.store.delete(entity.uid)

    return entity
  }

  /**
   * Retrieve a record by `uid`.
   *
   * @public
   * @instance
   * @async
   *
   * @param {ObjectId | string} uid
   *  The id of the record to find
   * @return {Promise<T | null>}
   *  An entity representing the matched record or `null`
   */
  public async findById(uid: ObjectId | string): Promise<T | null> {
    return new Promise(resolve => {
      /**
       * The matching record.
       *
       * @const {DatabaseRecord<T> | undefined} record
       */
      const record: DatabaseRecord<T> | undefined = this.store.get(String(uid))

      return void resolve(record ? this.mapper.toDomain(record) : null)
    })
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
