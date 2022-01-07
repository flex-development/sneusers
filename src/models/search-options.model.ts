import type { ObjectUnknown } from '@flex-development/tutils'
import { ObjectPlain } from '@flex-development/tutils'
import { ApiPropertyOptional } from '@nestjs/swagger'
import OrderDirection from '@sneusers/enums/order-direction.enum'
import type { SearchOption } from '@sneusers/types'
import { Expose } from 'class-transformer'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator'

/**
 * @file Models - SearchOptions
 * @module sneusers/models/SearchOptions
 */

/**
 * Options available when executing a search.
 *
 * @see {@link SearchOption}
 *
 * @template T - Entity attributes type
 */
export default class SearchOptions<T extends ObjectPlain = ObjectUnknown> {
  @ApiPropertyOptional({
    description: 'List of attributes to select',
    type: [String]
  })
  @IsString({ each: true })
  @IsOptional()
  attributes?: SearchOption.Attributes<T>

  @ApiPropertyOptional({
    description: 'List of rows to group (`GROUP BY` in sql)',
    externalDocs: {
      description: 'SQL GROUP BY Statement',
      url: 'https://www.w3schools.com/sql/sql_groupby.asp'
    },
    type: [String]
  })
  @IsString({ each: true })
  @IsOptional()
  group?: SearchOption.Group<T>

  @ApiPropertyOptional({
    description: 'Select group rows after groups and aggregates are computed'
  })
  @Expose()
  @IsOptional()
  having?: SearchOption.Where<T>

  @ApiPropertyOptional({
    default: 10,
    description: 'Limit number of results',
    minimum: 1,
    type: Number
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: SearchOption.Limit<T>

  @ApiPropertyOptional({
    default: true,
    description: 'Transform `.` separated property names into nested objects',
    example: "`{ 'user.name': 'john' }` => `{ user: { name: 'john' } }`",
    minimum: 1,
    type: Boolean
  })
  @IsBoolean()
  @IsOptional()
  nest?: SearchOption.Nest<T>

  @ApiPropertyOptional({
    description: 'Skip a certain number of results',
    minimum: 0,
    type: Number
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: SearchOption.Offset<T>

  @ApiPropertyOptional({
    default: [['id', OrderDirection.ASC]],
    description: 'Specify how to sort results',
    example: "[['last_login', 'NULLS FIRST'], ['id', 'ASC']]",
    isArray: true
  })
  @Expose()
  @IsOptional()
  order?: SearchOption.Order<T>

  @ApiPropertyOptional({ description: 'Filter selected results' })
  @Expose()
  @IsOptional()
  where?: SearchOption.Where<T>

  /**
   * Throw an `Exception` if an entity isn't found instead of returning `null`.
   *
   * @see {@link SearchOption.RejectOnEmpty}
   *
   * @default false
   */
  @IsBoolean()
  @IsOptional()
  rejectOnEmpty?: SearchOption.RejectOnEmpty<T>

  /** @property {Required<SearchOptions>} DEFAULTS - Default search options */
  static DEFAULTS: Required<SearchOptions> = {
    attributes: undefined as unknown as NonNullable<SearchOption.Attributes>,
    group: undefined as unknown as NonNullable<SearchOption.Group>,
    having: undefined as unknown as NonNullable<SearchOption.Where>,
    limit: 10,
    nest: true,
    offset: undefined as unknown as NonNullable<SearchOption.Offset>,
    order: [['id', OrderDirection.ASC]] as SearchOption.Order,
    rejectOnEmpty: false,
    where: undefined as unknown as NonNullable<SearchOption.Where>
  }

  constructor({
    attributes = SearchOptions.DEFAULTS.attributes,
    group = SearchOptions.DEFAULTS.group,
    having = SearchOptions.DEFAULTS.having,
    limit = SearchOptions.DEFAULTS.limit,
    nest = SearchOptions.DEFAULTS.nest,
    offset = SearchOptions.DEFAULTS.offset,
    order = SearchOptions.DEFAULTS.order,
    rejectOnEmpty = SearchOptions.DEFAULTS.rejectOnEmpty,
    where = SearchOptions.DEFAULTS.where
  }: ObjectPlain) {
    if (Array.isArray(attributes) && !attributes.includes('id')) {
      attributes.push('id')
    }

    this.attributes = attributes
    this.group = group
    this.having = having
    this.limit = limit
    this.nest = nest
    this.offset = offset
    this.order = order
    this.rejectOnEmpty = rejectOnEmpty
    this.where = where
  }
}
