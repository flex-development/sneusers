/**
 * @file Type Aliases - EntityData
 * @module sneusers/database/types/EntityData
 */

import type { IDocument } from '@flex-development/sneusers/database'
import type { ObjectId } from 'bson'

/**
 * Entity data transfer object.
 *
 * @template {IDocument} [T=IDocument]
 *  Database record
 */
type EntityData<T extends IDocument = IDocument> = Omit<T, '_id'> & {
  /**
   * Unique identifier.
   *
   * @see {@linkcode ObjectId}
   */
  _id?: ObjectId | null | undefined
}

export type { EntityData as default }
