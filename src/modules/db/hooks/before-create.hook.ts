import Entity from '../entities/entity.dao'

/**
 * @file DatabaseModule Hooks - beforeCreate
 * @module sneusers/modules/db/hooks/beforeCreate
 */

/**
 * Normalizes data before an entity is created.
 *
 * This includes:
 *
 * - Automatically hashing sensitive fields
 * - Forcing modification timestamps to be `null`
 *
 * @template M - Entity class
 *
 * @async
 * @param {M} instance - Entity instance
 * @return {Promise<void>} Empty promise when complete
 */
async function beforeCreate<M extends Entity = Entity>(
  instance: M
): Promise<void> {
  for (const field of Entity.AUTOHASH) {
    const secret = instance.dataValues[field]

    if (typeof secret !== 'string') continue

    instance.dataValues[field] = await Entity.scrypt.hash(secret)
    instance[field] = instance.dataValues[field]
  }

  for (const field of ['deleted_at', 'deletedAt', 'updated_at', 'updatedAt']) {
    if (!Object.keys(instance.dataValues).includes(field)) continue
    instance[field] = instance.dataValues[field] = null
  }
}

export default beforeCreate
