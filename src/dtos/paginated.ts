/**
 * @file Data Transfer Objects - PaginatedDTO
 * @module sneusers/dtos/PaginatedDTO
 */

import type { JsonifiableObject, ObjectPlain } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'

/**
 * Object representing a paginated response.
 *
 * @template T - Paginated data type
 *
 * @class
 */
class PaginatedDTO<T extends ObjectPlain = JsonifiableObject> {
  /**
   * Total number of records.
   *
   * @public
   * @instance
   * @member {number} count
   */
  @ApiProperty({ description: 'Total number of records', type: Number })
  public count: number

  /**
   * Number of results returned.
   *
   * @public
   * @instance
   * @member {number} limit
   */
  @ApiProperty({ description: 'Number of results returned', type: Number })
  public limit: number

  /**
   * Number of results skipped.
   *
   * @public
   * @instance
   * @member {number} offset
   */
  @ApiProperty({ description: 'Number of results skipped', type: Number })
  public offset: number

  /**
   * Array containing paginated data.
   *
   * @public
   * @instance
   * @member {T[]} results
   */
  public results: T[]

  /**
   * Total number of results.
   *
   * @public
   * @instance
   * @member {number} total
   */
  @ApiProperty({ description: 'Total number of results', type: Number })
  public total: number

  /**
   * Creates a new paginated response.
   *
   * @param {PaginatedDTO<T>} param0 - Response data
   * @param {number} param0.count - Total number of records
   * @param {number} param0.limit - Number of results returned
   * @param {number} param0.offset - Number of results skipped
   * @param {number} param0.total - Total number of results
   * @param {T[]} param0.results - Paginated data
   */
  constructor({ count, limit, offset, results, total }: PaginatedDTO<T>) {
    this.count = count
    this.limit = limit
    this.offset = offset
    this.results = results
    this.total = total
  }
}

export default PaginatedDTO
