import { FactoryProvider } from '@nestjs/common'
import { QueryInterface } from 'sequelize'
import { Umzug } from 'umzug'
import { UmzugOptionsFactory } from '../factories'

/**
 * @file DatabaseModule Providers - Umzug
 * @module sneusers/modules/db/providers/Umzug
 */

/**
 * Creates an {@link Umzug} provider.
 *
 * @return {FactoryProvider<Umzug<QueryInterface>>} Factory provider
 */
const UmzugProvider = (): FactoryProvider<Umzug<QueryInterface>> => ({
  inject: [UmzugOptionsFactory],
  provide: Umzug,
  // @ts-expect-error ts(2322)
  useFactory: async (
    factory: UmzugOptionsFactory
  ): Promise<Umzug<QueryInterface>> => {
    return new Umzug(await factory.createUmzugOptions())
  }
})

export default UmzugProvider
