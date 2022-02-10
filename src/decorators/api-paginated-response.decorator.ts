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
 * Documents a paginated response.
 *
 * @template T - Data model type
 *
 * @param {T} Model - Data model
 * @param {ApiResponseMetadata} [metadata={}] - Response metadata
 * @return {ReturnType<typeof applyDecorators>} Decorator function
 */
function ApiPaginatedResponse<T extends Type<any>>(
  Model: T,
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
