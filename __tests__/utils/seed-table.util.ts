import type { CreateOptions } from 'sequelize'
import { Model, ModelStatic } from 'sequelize-typescript'

/**
 * @file Global Test Utilities - seedTable
 * @module tests/utils/seedTable
 */

/**
 * Seeds a database table.
 *
 * @template M - Entity (dao) class type
 * @template A - Entity attributes
 * @template C - Data used to create new entity
 * @template O - Entity creation options
 *
 * @async
 * @param {ModelStatic<M>} model - Entity (dao) class
 * @param {C[]} [values=[]] - Data to create each entity
 * @param {O} [options={}] - Entity creation options
 * @return {Promise<M[]>} Promise containing new entities
 */
async function seedTable<
  M extends Model<any, any> = Model<any, any>,
  A extends M['_attributes'] = M['_attributes'],
  C extends M['_creationAttributes'] = M['_creationAttributes'],
  O extends CreateOptions<A> = CreateOptions<A>
>(model: ModelStatic<M>, values: C[] = [], options: O = {} as O): Promise<M[]> {
  options.ignoreDuplicates = true
  options.isNewRecord = true
  options.returning = true
  options.silent = true

  const repo = model as typeof Model & ModelStatic<M>
  const entities: M[] = []

  for (const dto of values) {
    entities.push(await repo.create<M, O>(dto, options))
  }

  return entities
}

export default seedTable
