/**
 * @file Test Utilities - DocumentFactory
 * @module tests/utils/DocumentFactory
 */

import SeedFactory from '#tests/utils/seed.factory'
import type { IDocument } from '@flex-development/sneusers/database'
import { ObjectId } from 'bson'

/**
 * Database record factory.
 *
 * @class
 * @extends {SeedFactory}
 */
class DocumentFactory extends SeedFactory {
  /**
   * Create a random database record.
   *
   * @public
   * @instance
   *
   * @return {IDocument}
   *  Database record
   */
  public makeOne(): IDocument {
    return { _id: new ObjectId(), created_at: Date.now(), updated_at: null }
  }
}

export default DocumentFactory
