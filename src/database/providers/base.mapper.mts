/**
 * @file Providers - Mapper
 * @module sneusers/database/providers/Mapper
 */

import type {
  DatabaseRecord,
  Entity,
  EntityData
} from '@flex-development/sneusers/database'
import type { Class } from '@flex-development/tutils'

/**
 * Abstract data mapper.
 *
 * @template {Entity} [T=Entity]
 *  Database entity
 *
 * @class
 * @abstract
 */
abstract class Mapper<T extends Entity = Entity> {
  /**
   * Entity class.
   *
   * @protected
   * @instance
   * @abstract
   * @member {Class<T>} Entity
   */
  protected abstract Entity: Class<T>

  /**
   * Create an entity.
   *
   * @public
   * @instance
   *
   * @param {EntityData<DatabaseRecord<T>>} data
   *  Existing database record or entity data transfer object
   * @return {T}
   *  Database entity instance
   */
  public toDomain(data: EntityData<DatabaseRecord<T>>): T {
    return new this.Entity(data)
  }

  /**
   * Convert an `entity` to a persistable database record.
   *
   * @public
   * @instance
   *
   * @param {T} entity
   *  The entity to convert
   * @return {DatabaseRecord<T>}
   *  Database record object
   */
  public toPersistence(entity: T): DatabaseRecord<T> {
    return entity.serialize()
  }
}

export default Mapper
