import isNumeric from 'validator/lib/isNumeric'
import Entity from '../entities/entity.dao'

/**
 * @file DatabaseModule Hooks - beforeSave
 * @module sneusers/modules/db/hooks/beforeSave
 */

/**
 * Normalizes data before an entity is persisted to the database.
 *
 * This includes:
 *
 * - Ensuring {@link instance.id} a number
 *
 * @template M - Entity class
 *
 * @param {M} instance - Entity instance
 * @return {void} Nothing when complete
 */
function beforeSave<M extends Entity = Entity>(instance: M): void {
  if (instance.id && isNumeric(instance.id.toString())) {
    instance.id = Number.parseInt(instance.id.toString())
  }
}

export default beforeSave
