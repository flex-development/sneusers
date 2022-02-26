import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { Numeric } from '@sneusers/types'

/**
 * @file DatabaseModule Utilities (Types) - createSequence
 * @module sneusers/modules/db/utils/createSequence/types
 */

/**
 * Options to define a new sequence generator.
 *
 * @see https://postgresql.org/docs/9.5/sql-createsequence.html
 *
 * @template T - Entity attributes
 */
export interface CreateSequenceOptions<T extends ObjectPlain = ObjectUnknown> {
  /**
   * Specifies how many sequence numbers are to be preallocated and stored in
   * memory for faster access. The minimum value is `1` (only one value can be
   * generated at a time, i.e., no cache).
   *
   * @default 1
   */
  cache?: number | Numeric

  /**
   * Allow the sequence to wrap when {@link CreateSequenceOptions.minvalue} or
   * {@link CreateSequenceOptions.maxvalue} has been reached by an ascending or
   * descending sequence respectively. If the limit is reached, the next number
   * generated will be the `minvalue` or `maxvalue`, respectively.
   *
   * @default false
   */
  cycle?: boolean

  /**
   * Do not throw an error if a relation with the same name already exists. A
   * notice is issued in this case.
   *
   * Note that there is no guarantee that the existing relation is anything like
   * the sequence that would have been created - it might not even be a
   * sequence.
   *
   * @default true
   */
  if_not_exists?: boolean

  /**
   * Specifies which value is added to the current sequence value to create a
   * new value.
   *
   * @default 1
   */
  increment?: number | Numeric

  /**
   * Determines the minimum value a sequence can generate.
   *
   * @see {@link SequenceMaxValue}
   */
  maxvalue?: SequenceMaxValue

  /**
   * Determines the minimum value a sequence can generate.
   *
   * @see {@link SequenceMinValue}
   */
  minvalue?: SequenceMinValue

  /**
   * Associate the sequence with a specific table column, such that if that
   * column (or its whole table) is dropped, the sequence will be automatically
   * dropped as well.
   *
   * @see {@link SequenceOwnedBy}
   *
   * @default 'NONE'
   */
  owned_by?: SequenceOwnedBy<T>

  /**
   * Specify where the sequence should begin from.
   *
   * The default starting value is {@link CreateSequenceOptions.minvalue} for
   * ascending sequences and {@link CreateSequenceOptions.maxvalue} for
   * descending ones.
   */
  start?: number | Numeric

  /**
   * If specified, the sequence object is created only for this session, and is
   * automatically dropped on session exit.
   *
   * Existing permanent sequences with the same name are not visible (in this
   * session) while the temporary sequence exists, unless they are referenced
   * with schema-qualified names.
   *
   * @default false
   */
  temp?: boolean
}

/**
 * Specifies which value is added to the current sequence value to create a
 * new value.
 *
 * @default 1
 */
export type SequenceIncrement = number | Numeric

/**
 * Determines the maximum value for the sequence.
 *
 * If this clause is not supplied or `NO MAXVALUE` is specified, then default
 * values will be used. The defaults are `1` and `-263-1` for ascending and
 * descending sequences, respectively.
 */
export type SequenceMaxValue = number | Numeric | 'NO MAXVALUE'

/**
 * Determines the minimum value a sequence can generate.
 *
 * If this clause is not supplied or `NO MINVALUE` is specified, then defaults
 * will be used. The defaults are `1` and `-263-1` for ascending and
 * descending sequences, respectively.
 */
export type SequenceMinValue = number | Numeric | 'NO MINVALUE'

/**
 * Associate the sequence with a specific table column, such that if that
 * column (or its whole table) is dropped, the sequence will be automatically
 * dropped as well.
 *
 * The specified table must have the same owner and be in the same schema as
 * the sequence.
 *
 * @template T - Entity attributes
 *
 * @default 'NONE'
 */
export type SequenceOwnedBy<T extends ObjectPlain = ObjectUnknown> =
  | keyof T
  | 'NONE'
