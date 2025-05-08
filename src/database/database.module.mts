/**
 * @file DatabaseModule
 * @module sneusers/database/DatabaseModule
 */

import Mapper from '#database/providers/base.mapper'
import type { Class } from '@flex-development/tutils'
import {
  Global,
  Module,
  type DynamicModule,
  type InjectionToken,
  type Provider
} from '@nestjs/common'

/**
 * Database module.
 *
 * @class
 */
@Global()
@Module({})
class DatabaseModule {
  /**
   * Create a data mapper class.
   *
   * @public
   * @static
   *
   * @param {Class<any>} Entity
   *  Database entity model
   * @return {Class<Mapper>}
   *  Data mapper class
   */
  public static Mapper(Entity: Class<any>): Class<Mapper> {
    /**
     * Entity data mapper.
     *
     * @class
     * @extends {Mapper}
     */
    return class EntityMapper extends Mapper {
      /**
       * @public
       * @static
       * @override
       * @member {string} name
       */
      public static override name: string = Entity.name + 'Mapper'

      /**
       * @protected
       * @instance
       * @member {Class<any>} Entity
       */
      protected Entity: Class<any> = Entity

      /**
       * Create a new data mapper.
       */
      constructor() {
        super()
        Object.assign(this, { name: EntityMapper.name })
      }
    }
  }

  /**
   * Register database entities.
   *
   * @public
   * @static
   *
   * @param {Class<any>[]} entities
   *  List of database entities to register
   * @return {DynamicModule}
   *  Dynamic feature module
   */
  public static forFeature(...entities: Class<any>[]): DynamicModule {
    /**
     * List of injection tokens representing exported providers.
     *
     * @const {InjectionToken[]} exports
     */
    const exports: InjectionToken[] = []

    /**
     * List of feature module providers.
     *
     * @const {Provider[]} providers
     */
    const providers: Provider[] = []

    // provide data mappers.
    for (const Entity of entities) {
      /**
       * Data mapper class.
       *
       * @const {Class<Mapper>} EntityMapper
       */
      const EntityMapper: Class<Mapper> = DatabaseModule.Mapper(Entity)

      providers.push({ provide: EntityMapper.name, useClass: EntityMapper })
      exports.push(EntityMapper.name)
    }

    return { exports, global: false, module: DatabaseModule, providers }
  }
}

export default DatabaseModule
