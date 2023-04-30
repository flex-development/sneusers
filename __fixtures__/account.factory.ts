/**
 * @file Fixtures - AccountFactory
 * @module fixtures/AccountFactory
 */

import type { Constructor } from '@mikro-orm/core'
import type { MongoEntityManager } from '@mikro-orm/mongodb'
import { Factory, Faker } from '@mikro-orm/seeder'
import Account from './account.entity'

/**
 * Account entity factory.
 *
 * @see {@linkcode Account}
 *
 * @class
 * @extends {Factory<Account>}
 */
class AccountFactory extends Factory<Account> {
  /**
   * Entity the factory generates entity instances for.
   *
   * @public
   * @readonly
   * @member {Constructor<Account>} model
   */
  public readonly model: Constructor<Account>

  /**
   * Creates a new {@linkcode Account} entity factory.
   *
   * @param {MongoEntityManager} em - Entity manager
   */
  constructor(em: MongoEntityManager) {
    super(em)
    this.model = Account
  }

  /**
   * Returns the default set of attribute values that should be applied when
   * creating an {@linkcode Account} entity.
   *
   * @see https://fakerjs.dev
   *
   * @protected
   * @override
   *
   * @param {Faker} faker - Faker library
   * @return {{ email: Account['email'] }} Account entity data
   */
  protected override definition(faker: Faker): { email: Account['email'] } {
    return { email: faker.internet.email().toLowerCase() }
  }
}

export default AccountFactory
