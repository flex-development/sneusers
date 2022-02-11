import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'

/**
 * @file Data Transfer Objects - PaginatedDTO
 * @module sneusers/dtos/PaginatedDTO
 */

/**
 * Object representing a paginated response.
 *
 * @template T - Paginated data type
 */
class PaginatedDTO<T extends ObjectPlain = ObjectUnknown> {
  @ApiProperty({ description: 'Total number of results', type: Number })
  total: number

  @ApiProperty({ description: 'Total number of records', type: Number })
  count: number

  @ApiProperty({ description: 'Number of results returned', type: Number })
  limit: number

  @ApiProperty({ description: 'Number of results skipped', type: Number })
  offset: number

  /** Array containing paginated data. */
  results: T[]

  /**
   * Creates a new `PaginatedDTO`.
   *
   * @param {ObjectPlain} param0 - Response data
   * @param {number} param0.count - Total number of records
   * @param {number} param0.limit - Number of results returned
   * @param {number} param0.offset - Number of results skipped
   * @param {number} param0.total - Total number of results
   * @param {T[]} param0.results - Paginated data
   */
  constructor({ count, limit, offset, results, total }: ObjectPlain) {
    if (typeof count === 'number') this.count = count
    if (typeof limit === 'number') this.limit = limit
    if (typeof offset === 'number') this.offset = offset
    if (Array.isArray(results)) this.results = results
    if (typeof total === 'number') this.total = total
  }
}

export default PaginatedDTO
