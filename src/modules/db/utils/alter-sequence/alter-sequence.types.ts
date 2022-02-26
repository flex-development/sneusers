import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { Numeric } from '@sneusers/types'
import { CreateSequenceOptions } from '../create-sequence'

/**
 * @file DatabaseModule Utilities (Types) - alterSequence
 * @module sneusers/modules/db/utils/alterSequence/types
 */

/**
 * Options to change the definition of a sequence generator.
 *
 * @see https://postgresql.org/docs/9.5/sql-altersequence.html
 *
 * @template T - Entity attributes
 */
export interface AlterSequenceOptions<T extends ObjectUnknown = ObjectPlain> {
  /** @see {@link CreateSequenceOptions.cache} */
  cache?: CreateSequenceOptions<T>['cache']

  /** @see {@link CreateSequenceOptions.cycle} */
  cycle?: CreateSequenceOptions<T>['cycle']

  /**
   * Do not throw an error if the sequence does not exist. A notice is issued in
   * this case.
   *
   * @default true
   */
  if_exists?: boolean

  /** @see {@link CreateSequenceOptions.increment} */
  increment?: CreateSequenceOptions<T>['increment']

  /** @see {@link CreateSequenceOptions.maxvalue} */
  maxvalue?: CreateSequenceOptions<T>['maxvalue']

  /** @see {@link CreateSequenceOptions.minvalue} */
  minvalue?: CreateSequenceOptions<T>['minvalue']

  /**
   * The new name for the sequence.
   */
  new_name?: string

  /**
   * The user name of the new owner of the sequence.
   */
  new_owner?: string

  /**
   * The new schema for the sequence.
   */
  new_schema?: string

  /** @see {@link CreateSequenceOptions.owned_by} */
  owned_by?: CreateSequenceOptions<T>['owned_by']

  /**
   * Changes the current value of the sequence.
   */
  restart?: number | Numeric

  /** @see {@link CreateSequenceOptions.start} */
  start?: CreateSequenceOptions<T>['start']
}
