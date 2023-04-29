/**
 * @file Interfaces - IEntity
 * @module sneusers/interfaces/IEntity
 */

import type { Nullable } from '@flex-development/tutils'
import type { ObjectId } from '@mikro-orm/mongodb'

/**
 * Object representing a database collection entity.
 */
interface IEntity {
  /**
   * BSON object id.
   *
   * @see {@linkcode ObjectId}
   */
  _id: ObjectId

  /**
   * [Unix timestamp][1] indicating when entity was created.
   *
   * [1]: https://unixtimestamp.com
   */
  created_at: number

  /**
   * [Unix timestamp][1] indicating when entity was last modified.
   *
   * [1]: https://unixtimestamp.com
   *
   * @default null
   */
  updated_at: Nullable<number>
}

export type { IEntity as default }
