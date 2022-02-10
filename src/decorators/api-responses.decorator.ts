import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiGatewayTimeoutResponse,
  ApiGoneResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiMovedPermanentlyResponse,
  ApiNoContentResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiPayloadTooLargeResponse,
  ApiPreconditionFailedResponse,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiResponseOptions,
  ApiServiceUnavailableResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUnsupportedMediaTypeResponse
} from '@nestjs/swagger'
import { Exception } from '@sneusers/exceptions'

/**
 * @file Decorators - ApiResponses
 * @module sneusers/decorators/ApiResponses
 */

type ResponseMap = Partial<Record<HttpStatus, ApiResponseOptions>>

/**
 * Documents API responses.
 *
 * @param {ResponseMap} [map={}] - Response options map
 * @return {ReturnType<typeof applyDecorators>} Decorator function
 */
const ApiResponses = (
  map: ResponseMap = {}
): ReturnType<typeof applyDecorators> => {
  const responses: (ClassDecorator & MethodDecorator)[] = []

  if (!map[HttpStatus.INTERNAL_SERVER_ERROR]) {
    map[HttpStatus.INTERNAL_SERVER_ERROR] = {
      description: 'Internal server error',
      type: Exception
    }
  }

  if (!map[HttpStatus.BAD_GATEWAY]) {
    map[HttpStatus.BAD_GATEWAY] = {
      description: 'Nginx reverse proxy failure',
      type: String
    }
  }

  for (const [status, options] of Object.entries(map)) {
    let Decorator: typeof ApiResponse
    const code = Number.parseInt(status) as HttpStatus

    switch (code) {
      case HttpStatus.OK:
        Decorator = ApiOkResponse
        break
      case HttpStatus.CREATED:
        Decorator = ApiCreatedResponse
        break
      case HttpStatus.ACCEPTED:
        Decorator = ApiAcceptedResponse
        break
      case HttpStatus.NO_CONTENT:
        Decorator = ApiNoContentResponse
        break
      case HttpStatus.MOVED_PERMANENTLY:
        Decorator = ApiMovedPermanentlyResponse
        break
      case HttpStatus.FOUND:
        Decorator = ApiFoundResponse
        break
      case HttpStatus.BAD_REQUEST:
        Decorator = ApiBadRequestResponse
        break
      case HttpStatus.UNAUTHORIZED:
        Decorator = ApiUnauthorizedResponse
        break
      case HttpStatus.FORBIDDEN:
        Decorator = ApiForbiddenResponse
        break
      case HttpStatus.NOT_FOUND:
        Decorator = ApiNotFoundResponse
        break
      case HttpStatus.METHOD_NOT_ALLOWED:
        Decorator = ApiMethodNotAllowedResponse
        break
      case HttpStatus.NOT_ACCEPTABLE:
        Decorator = ApiNotAcceptableResponse
        break
      case HttpStatus.REQUEST_TIMEOUT:
        Decorator = ApiRequestTimeoutResponse
        break
      case HttpStatus.CONFLICT:
        Decorator = ApiConflictResponse
        break
      case HttpStatus.GONE:
        Decorator = ApiGoneResponse
        break
      case HttpStatus.PRECONDITION_FAILED:
        Decorator = ApiPreconditionFailedResponse
        break
      case HttpStatus.PAYLOAD_TOO_LARGE:
        Decorator = ApiPayloadTooLargeResponse
        break
      case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
        Decorator = ApiUnsupportedMediaTypeResponse
        break
      case HttpStatus.UNPROCESSABLE_ENTITY:
        Decorator = ApiUnprocessableEntityResponse
        break
      case HttpStatus.TOO_MANY_REQUESTS:
        Decorator = ApiTooManyRequestsResponse
        break
      case HttpStatus.INTERNAL_SERVER_ERROR:
        Decorator = ApiInternalServerErrorResponse
        break
      case HttpStatus.NOT_IMPLEMENTED:
        Decorator = ApiNotImplementedResponse
        break
      case HttpStatus.BAD_GATEWAY:
        Decorator = ApiBadGatewayResponse
        break
      case HttpStatus.SERVICE_UNAVAILABLE:
        Decorator = ApiServiceUnavailableResponse
        break
      case HttpStatus.GATEWAY_TIMEOUT:
        Decorator = ApiGatewayTimeoutResponse
        break
      default:
        Decorator = ApiResponse
    }

    responses.push(Decorator(options))
  }

  return applyDecorators(...responses)
}

export default ApiResponses
