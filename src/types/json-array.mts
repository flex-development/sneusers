/**
 * @file Type Aliases - JsonArray
 * @module sneusers/types/JsonArray
 */

import type { JsonValue } from '@flex-development/sneusers/types'

/**
 * An array containing [JSON values][json-data-types].
 *
 * [json-data-types]: https://restfulapi.net/json-data-types
 */
type JsonArray = JsonValue[] | readonly JsonValue[]

export type { JsonArray as default }
