/**
 * @file Test Utilities - SeedFactory
 * @module tests/utils/SeedFactory
 */

import type { Faker } from '@faker-js/faker'
import type { IDocument } from '@flex-development/sneusers/database'
import { iterate } from '@flex-development/tutils'

/**
 * Abstract database record factory.
 *
 * @template {IDocument} [T=IDocument]
 *  Database record
 *
 * @class
 * @abstract
 */
abstract class SeedFactory<T extends IDocument = IDocument> {
  /**
   * Faker library module.
   *
   * @see https://fakerjs.dev
   *
   * @public
   * @instance
   * @readonly
   * @member {Faker} faker
   */
  public readonly faker: Faker

  /**
   * Create a new database record factory.
   */
  constructor() {
    this.faker = faker
  }

  /**
   * Create a list of random database records.
   *
   * @public
   * @instance
   *
   * @param {number} [count=10]
   *  The number of records to include in the list
   * @return {T[]}
   *  List of database records
   */
  public make(count: number = 10): T[] {
    /**
     * List of database records.
     *
     * @const {T[]} list
     */
    const list: T[] = []

    return iterate(count, 0, () => list.push(this.makeOne())), list
  }

  /**
   * Create a random database record.
   *
   * @public
   * @instance
   * @abstract
   *
   * @return {T}
   *  Database record
   */
  public abstract makeOne(): T
}

export default SeedFactory
