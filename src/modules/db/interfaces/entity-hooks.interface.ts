import { QueryOptions, SyncOptions } from 'sequelize/types'
import { HookReturn, ModelHooks } from 'sequelize/types/lib/hooks'
import { ValidationOptions } from 'sequelize/types/lib/instance-validator'
import {
  BulkCreateOptions,
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  InstanceDestroyOptions,
  InstanceRestoreOptions,
  InstanceUpdateOptions,
  RestoreOptions,
  UpdateOptions,
  UpsertOptions
} from 'sequelize/types/lib/model'
import { AbstractQuery } from 'sequelize/types/lib/query'
import type { Entity } from '../entities'

/**
 * @file DatabaseModule Interfaces - EntityHooks
 * @module sneusers/modules/db/interfaces/EntityHooks
 */

/**
 * Response types produced by the `EntitySerializer`.
 *
 * @template E - Entity class type
 * @template TAttributes - Entity attributes
 */
interface EntityHooks<
  E extends Entity = Entity,
  TAttributes extends Entity['_attributes'] = Entity['_attributes']
  // @ts-expect-error shut the fuck up
> extends ModelHooks<E, TAttributes> {
  afterBulkCreate(
    instances: readonly E[],
    options: BulkCreateOptions<TAttributes>
  ): HookReturn
  afterBulkDestroy(options: DestroyOptions<TAttributes>): HookReturn
  afterBulkRestore(options: RestoreOptions<TAttributes>): HookReturn
  afterBulkSync(options: SyncOptions): HookReturn
  afterBulkUpdate(options: UpdateOptions<TAttributes>): HookReturn
  afterCreate(attributes: E, options: CreateOptions<TAttributes>): HookReturn
  afterDestroy(instance: E, options: InstanceDestroyOptions): HookReturn
  afterFind(
    instancesOrInstance: readonly E[] | E | null,
    options: FindOptions<TAttributes>
  ): HookReturn
  afterQuery(options: QueryOptions, query: AbstractQuery): HookReturn
  afterRestore(instance: E, options: InstanceRestoreOptions): HookReturn
  afterSave(
    instance: E,
    options: InstanceUpdateOptions<TAttributes> | CreateOptions<TAttributes>
  ): HookReturn
  afterSync(options: SyncOptions): HookReturn
  afterUpdate(
    instance: E,
    options: InstanceUpdateOptions<TAttributes>
  ): HookReturn
  afterUpsert(
    attributes: [E, boolean | null],
    options: UpsertOptions<TAttributes>
  ): HookReturn
  afterValidate(instance: E, options: ValidationOptions): HookReturn
  beforeBulkCreate(
    instances: E[],
    options: BulkCreateOptions<TAttributes>
  ): HookReturn
  beforeBulkDestroy(options: DestroyOptions<TAttributes>): HookReturn
  beforeBulkRestore(options: RestoreOptions<TAttributes>): HookReturn
  beforeBulkSync(options: SyncOptions): HookReturn
  beforeBulkUpdate(options: UpdateOptions<TAttributes>): HookReturn
  beforeCount(options: CountOptions<TAttributes>): HookReturn
  beforeCreate(attributes: E, options: CreateOptions<TAttributes>): HookReturn
  beforeDestroy(instance: E, options: InstanceDestroyOptions): HookReturn
  beforeFind(options: FindOptions<TAttributes>): HookReturn
  beforeFindAfterExpandIncludeAll(options: FindOptions<TAttributes>): HookReturn
  beforeFindAfterOptions(options: FindOptions<TAttributes>): HookReturn
  beforeQuery(options: QueryOptions, query: AbstractQuery): HookReturn
  beforeRestore(instance: E, options: InstanceRestoreOptions): HookReturn
  beforeSave(
    instance: E,
    options: InstanceUpdateOptions<TAttributes> | CreateOptions<TAttributes>
  ): HookReturn
  beforeSync(options: SyncOptions): HookReturn
  beforeUpdate(
    instance: E,
    options: InstanceUpdateOptions<TAttributes>
  ): HookReturn
  beforeUpsert(attributes: E, options: UpsertOptions<TAttributes>): HookReturn
  beforeValidate(instance: E, options: ValidationOptions): HookReturn
}

export default EntityHooks
