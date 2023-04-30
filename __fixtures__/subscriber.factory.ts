/**
 * @file Fixtures - SubscriberFactory
 * @module fixtures/SubscriberFactory
 */

import type { Constructor } from '@mikro-orm/core'
import type { MongoEntityManager } from '@mikro-orm/mongodb'
import { Factory, Faker } from '@mikro-orm/seeder'
import Subscriber from './subscriber.entity'

/**
 * Subscriber entity factory.
 *
 * @see {@linkcode Subscriber}
 *
 * @class
 * @extends {Factory<Subscriber>}
 */
class SubscriberFactory extends Factory<Subscriber> {
  /**
   * Entity the factory generates entity instances for.
   *
   * @public
   * @readonly
   * @member {Constructor<Subscriber>} model
   */
  public readonly model: Constructor<Subscriber>

  /**
   * Creates a new {@linkcode Subscriber} entity factory.
   *
   * @param {MongoEntityManager} em - Entity manager
   */
  constructor(em: MongoEntityManager) {
    super(em)
    this.model = Subscriber
  }

  /**
   * Returns the default set of attribute values that should be applied when
   * creating an {@linkcode Subscriber} entity.
   *
   * @see https://fakerjs.dev
   *
   * @protected
   * @override
   *
   * @param {Faker} faker - Faker library
   * @return {Pick<Subscriber, 'email' | 'name'>} Subscriber entity data
   */
  protected override definition(
    faker: Faker
  ): Pick<Subscriber, 'email' | 'name'> {
    return {
      email: faker.internet.email().toLowerCase(),
      name: faker.person.firstName()
    }
  }
}

export default SubscriberFactory
