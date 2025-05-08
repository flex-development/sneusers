/**
 * @file Type Aliases - DatabaseRecord
 * @module sneusers/database/types/DatabaseRecord
 */

import type { Entity } from '@flex-development/sneusers/database'

/**
 * Get the record schema for entity `T`.
 *
 * @template {Entity} [T=Entity]
 *  Database entity
 */
// @ts-expect-error private member (4105).
type DatabaseRecord<T extends Entity = Entity> = T['$']

export type { DatabaseRecord as default }
