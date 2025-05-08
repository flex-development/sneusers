/**
 * @file Snapshot Serializers - openapi
 * @module tests/serializers/openapi
 * @see https://vitest.dev/guide/snapshot
 */

import type { OpenAPIObject } from '@nestjs/swagger'
import { ok } from 'devlop'
import type { SnapshotSerializer } from 'vitest'

/**
 * OpenAPI specification object snapshot serializer.
 *
 * @const {SnapshotSerializer} serializer
 */
const serializer: SnapshotSerializer = { print, test }

export default serializer

/**
 * Print a snapshot value.
 *
 * > 👉 **Note**: `value` is expected to be an {@linkcode OpenAPIObject}.
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to print
 * @return {string}
 *  Snapshot value
 */
function print(this: void, value: unknown): string {
  ok(test(value), 'expected `value` to pass `test`')
  return JSON.stringify(value, null, 2)
}

/**
 * Check if `value` is looks like an {@linkcode OpenAPIObject}.
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {value is OpenAPIObject}
 *  `true` if `value` looks like OpenAPI specification object
 */
function test(this: void, value: unknown): value is OpenAPIObject {
  return (
    value !== null &&
    typeof value === 'object' &&
    'openapi' in value &&
    value.openapi === '3.0.0'
  )
}
