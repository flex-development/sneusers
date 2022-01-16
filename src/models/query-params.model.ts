import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import { ApiPropertyOptional } from '@nestjs/swagger'
import OrderDirection from '@sneusers/enums/order-direction.enum'
import type { QueryParam } from '@sneusers/types'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator'

/**
 * @file Models - QueryParams
 * @module sneusers/models/QueryParams
 */

/**
 * URL query parameters available when executing a search.
 *
 * @see {@link QueryParam}
 *
 * @template T - Entity attributes
 */
class QueryParams<T extends ObjectPlain = ObjectUnknown> {
  @ApiPropertyOptional({
    description: 'Comma-delimited list of attributes to select',
    type: String
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  attributes?: QueryParam.Attributes<T>

  @ApiPropertyOptional({
    description: 'Comma-delimited list of rows to group (`GROUP BY` in sql)',
    externalDocs: {
      description: 'SQL GROUP BY Statement',
      url: 'https://www.w3schools.com/sql/sql_groupby.asp'
    },
    type: String
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  group?: QueryParam.Group<T>

  @ApiPropertyOptional({
    description: 'Select group rows after groups and aggregates are computed',
    type: Object
  })
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  having?: QueryParam.Where<T>

  @ApiPropertyOptional({
    default: 10,
    description: 'Limit number of results',
    minimum: 1,
    type: Number
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: QueryParam.Limit<T>

  /**
   * @internal
   * @see {@link QueryParam.Lock}
   */
  lock?: QueryParam.Lock

  @ApiPropertyOptional({
    default: true,
    description: 'Transform `.` separated property names into nested objects',
    example: "`{ 'user.name': 'john' }` => `{ user: { name: 'john' } }`",
    minimum: 1,
    type: Boolean
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  nest?: QueryParam.Nest<T>

  @ApiPropertyOptional({
    description: 'Skip a certain number of results',
    minimum: 0,
    type: Number
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: QueryParam.Offset<T>

  @ApiPropertyOptional({
    default: `id,${OrderDirection.ASC}`,
    description: 'Comma or bar delimited list specifying how to sort results',
    examples: ['id', 'id,name', 'id,ASC|last_name,DESC'],
    externalDocs: {
      description: 'Sequelize: Ordering & Grouping',
      url: `https://sequelize.org/v7/manual/model-querying-basics#ordering-and-grouping`
    },
    type: String
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  order?: QueryParam.Order<T>

  /**
   * @internal
   * @see {@link QueryParam.RejectOnEmpty}
   */
  rejectOnEmpty?: QueryParam.RejectOnEmpty

  @ApiPropertyOptional({ description: 'Filter selected results', type: Object })
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  where?: QueryParam.Where<T>
}

export default QueryParams
