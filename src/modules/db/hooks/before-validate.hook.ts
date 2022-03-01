import type { Literal } from 'sequelize/types/lib/utils'
import isDate from 'validator/lib/isDate'
import Entity from '../entities/entity.dao'
import type { Timestamp } from '../types'

/**
 * @file DatabaseModule Hooks - beforeValidate
 * @module sneusers/modules/db/hooks/beforeValidate
 */

/**
 * Prepares `instance` for validation.
 *
 * This includes:
 *
 * - Forcing the use of unix timestamps
 *
 * @template M - Entity class
 *
 * @param {M} instance - Entity instance
 * @return {void} Nothing when complete
 */
function beforeValidate<M extends Entity = Entity>(instance: M): void {
  if (instance.isNewRecord || (!instance.id && !instance.updated_at)) {
    const NOW = Entity.CURRENT_TIMESTAMP

    let created_at = instance.created_at as Timestamp | Literal | undefined

    if (created_at && isDate(created_at.toString())) {
      created_at = new Date(created_at.toString()).getTime()
    }

    if ((NOW as Literal).val === (created_at as Literal)?.val) {
      created_at = Date.now()
    }

    instance.created_at = (created_at || Date.now()) as number
    instance.isNewRecord = true
    instance.updated_at = null
  } else instance.updated_at = Date.now()
}

export default beforeValidate
