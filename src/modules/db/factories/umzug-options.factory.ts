import type { OrPromise } from '@flex-development/tutils'
import type { QueryInterface } from 'sequelize'
import type { UmzugOptions } from 'umzug'

/**
 * @file DatabaseModule Factories - UmzugOptionsFactory
 * @module sneusers/modules/db/factories/UmzugOptionsFactory
 */

/**
 * Creates [`umzug`][1] options.
 *
 * [1]: https://github.com/sequelize/umzug
 *
 * @see https://github.com/sequelize/umzug
 *
 * @template Q - Query interface
 *
 * @abstract
 */
abstract class UmzugOptionsFactory<Q extends QueryInterface = QueryInterface> {
  abstract createUmzugOptions(): OrPromise<UmzugOptions<Q>>
}

export default UmzugOptionsFactory
