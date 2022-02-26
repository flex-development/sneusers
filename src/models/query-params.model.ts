import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrderDirection } from '@sneusers/modules/db/enums'
import { EntityQueryParam } from '@sneusers/modules/db/namespaces'
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
import type { Model } from 'sequelize-typescript'

/**
 * @file Models - QueryParams
 * @module sneusers/models/QueryParams
 */

/**
 * URL query parameters available when executing a search.
 *
 * @see {@link EntityQueryParam}
 *
 * @template T - Raw entity attributes
 */
class QueryParams<T extends ObjectPlain = ObjectUnknown> {
  @ApiPropertyOptional({
    description: 'Comma-delimited list of attributes to select',
    type: String
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  attributes?: EntityQueryParam.Attributes<T>

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
  group?: EntityQueryParam.Group<T>

  @ApiPropertyOptional({
    description: 'Select group rows after groups and aggregates are computed',
    type: Object
  })
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  having?: EntityQueryParam.Where<T>

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
  limit?: EntityQueryParam.Limit<T>

  /**
   * @internal
   * @see {@link QueryParam.Lock}
   */
  lock?: EntityQueryParam.Lock<T extends Model ? T : never>

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
  nest?: EntityQueryParam.Nest<T>

  @ApiPropertyOptional({
    description: 'Skip a certain number of results',
    minimum: 0,
    type: Number
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: EntityQueryParam.Offset<T>

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
  order?: EntityQueryParam.Order<T>

  /**
   * @internal
   * @see {@link QueryParam.RejectOnEmpty}
   */
  rejectOnEmpty?: EntityQueryParam.RejectOnEmpty<T>

  @ApiPropertyOptional({ description: 'Filter selected results', type: Object })
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  where?: EntityQueryParam.Where<T>
}

export default QueryParams
