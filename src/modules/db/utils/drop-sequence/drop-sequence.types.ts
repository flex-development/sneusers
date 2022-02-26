/**
 * @file DatabaseModule Utilities (Types) - dropSequence
 * @module sneusers/modules/db/utils/dropSequence/types
 */

/**
 * Options to remove a sequence.
 *
 * @see https://postgresql.org/docs/9.5/sql-dropsequence.html
 */
export interface DropSequenceOptions {
  /**
   * Automatically drop objects that depend on the sequence, or refuse to drop
   * the sequence if any objects depend on it.
   *
   * @default DropSequenceDependencies.RESTRICT
   */
  dependencies?: DropSequenceDependencies

  /**
   * Do not throw an error if the sequence does not exist. A notice is issued in
   * this case.
   *
   * @default true
   */
  if_exists?: boolean
}

/**
 * Automatically drop objects that depend on the sequence, or refuse to drop
 * the sequence if any objects depend on it.
 *
 * @enum {Uppercase<string>}
 */
export enum DropSequenceDependencies {
  CASCADE = 'CASCADE',
  RESTRICT = 'RESTRICT'
}
