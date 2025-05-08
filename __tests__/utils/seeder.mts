/**
 * @file Test Utilities - Seeder
 * @module tests/utils/Seeder
 */

import type SeedFactory from '#tests/utils/seed.factory'
import type {
  Entity,
  IDocument,
  Repository
} from '@flex-development/sneusers/database'

/**
 * Database repository seeder.
 *
 * @template {IDocument} [T=IDocument]
 *  Database record
 *
 * @class
 */
class Seeder<T extends IDocument = IDocument> {
  /**
   * Seeded records.
   *
   * @public
   * @readonly
   * @member {T[]} seeds
   */
  public readonly seeds: T[]

  /**
   * Create a new seeder.
   *
   * @param {SeedFactory<T>} factory
   *  Collection document factory
   * @param {Repository<Entity<T>>} repository
   *  The repository to seed
   */
  constructor(
    protected factory: SeedFactory<T>,
    protected repository: Repository<Entity<T>>
  ) {
    this.seeds = []
  }

  /**
   * Clear the repository.
   *
   * @public
   * @instance
   * @async
   *
   * @return {Promise<this>}
   *  `this` seeder
   */
  public async down(): Promise<this> {
    return new Promise(resolve => { // @ts-expect-error testing (2445).
      return this.repository.store.clear(), resolve(this)
    })
  }

  /**
   * Seed the repository.
   *
   * @public
   * @instance
   * @async
   *
   * @param {number} [count]
   *  The number of seeds to generate
   * @return {Promise<this>}
   *  `this` seeder
   */
  public async up(count?: number): Promise<this> {
    return new Promise(resolve => {
      // generate seeds.
      this.seeds.push(...this.factory.make(count))

      // seed repository.
      for (const seeds of this.seeds) { // @ts-expect-error testing (2445).
        this.repository.store.set(String(seeds._id), seeds)
      }

      return resolve(this)
    })
  }
}

export default Seeder
