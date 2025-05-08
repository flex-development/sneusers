/**
 * @file Interfaces - IDocument
 * @module sneusers/database/interfaces/IDocument
 */

import type { ObjectId } from 'bson'

/**
 * A database record.
 */
interface IDocument {
  /**
   * BSON object id.
   *
   * @see {@linkcode ObjectId}
   */
  _id: ObjectId

  /**
   * [Unix timestamp][timestamp] indicating when document was created.
   *
   * [timestamp]: https://unixtimestamp.com
   */
  created_at: number

  /**
   * [Unix timestamp][timestamp] indicating when document was last modified.
   *
   * [timestamp]: https://unixtimestamp.com
   */
  updated_at: number | null
}

export type { IDocument as default }
