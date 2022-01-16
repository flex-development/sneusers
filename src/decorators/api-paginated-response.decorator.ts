import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiResponseMetadata,
  getSchemaPath
} from '@nestjs/swagger'
import { PaginatedDTO } from '@sneusers/dtos'

/**
 * @file Decorators - ApiPaginatedResponse
 * @module sneusers/decorators/ApiPaginatedResponse
 */

/**
 * Documents a paginated response in OpenAPI format.
 *
 * @template TModel - Data model class type
 *
 * @param {TModel} Model - Result data model class
 * @param {ApiResponseMetadata} [metadata={}] - Response metadata
 * @return {ReturnType<typeof applyDecorators>} Decorator function
 */
function ApiPaginatedResponse<TModel extends Type<any>>(
  Model: TModel,
  metadata: ApiResponseMetadata = {}
): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOkResponse({
      ...metadata,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDTO) },
          {
            properties: {
              results: {
                items: { $ref: getSchemaPath(Model) },
                type: 'array'
              }
            }
          }
        ],
        title: `Paginated${Model.name}`
      }
    })
  )
}

export default ApiPaginatedResponse
