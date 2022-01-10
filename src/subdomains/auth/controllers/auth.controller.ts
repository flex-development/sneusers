import type { OneOrMany } from '@flex-development/tutils'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import { EntityDTOInterceptor } from '@sneusers/interceptors'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import { CreateUserDTO, UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import { PasswordInterceptor } from '@sneusers/subdomains/users/interceptors'
import OPENAPI from './openapi/auth.openapi'

/**
 * @file Auth Subdomain Controllers - AuthController
 * @module sneusers/subdomains/controllers/auth/AuthController
 */

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntityDTOInterceptor<User, OneOrMany<UserDTO>>())
@UseInterceptors(PasswordInterceptor)
export default class AuthController {
  constructor(protected readonly auth: AuthService) {}

  @Post(OPENAPI.register.path)
  @HttpCode(OPENAPI.register.status)
  @ApiCreatedResponse(OPENAPI.register.responses[201])
  @ApiConflictResponse(OPENAPI.register.responses[409])
  @ApiUnprocessableEntityResponse(OPENAPI.register.responses[422])
  @ApiInternalServerErrorResponse(OPENAPI.register.responses[500])
  @ApiBadGatewayResponse(OPENAPI.register.responses[502])
  async register(
    @Body(new ValidationPipe({ forbidUnknownValues: true })) dto: CreateUserDTO
  ): Promise<UserDTO> {
    return (await this.auth.register(dto)) as UserDTO
  }
}
