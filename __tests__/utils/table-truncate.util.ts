import type { TruncateOptions } from 'sequelize'
import { Model, ModelStatic } from 'sequelize-typescript'

/**
 * @file Global Test Utilities - tableTruncate
 * @module tests/utils/tableTruncate
 */

/**
 * Truncates a database table.
 *
 * @template M - Entity (dao) class type
 * @template A - Entity attributes
 * @template O - Table truncate options
 *
 * @async
 * @param {ModelStatic<M>} model - Entity (dao) class
 * @param {O} [options={}] - Table truncate options
 * @return {Promise<void>} Empty promise when complete
 */
async function tableTruncate<
  M extends Model<any, any> = Model<any, any>,
  A extends M['_attributes'] = M['_attributes'],
  O extends TruncateOptions<A> = TruncateOptions<A>
>(model: ModelStatic<M>, options: O = {} as O): Promise<void> {
  options.cascade = true
  options.individualHooks = true
  options.restartIdentity = true

  return (model as typeof Model & ModelStatic<M>).truncate(options)
}

export default tableTruncate
