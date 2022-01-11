import type { OneOrMany } from '@flex-development/tutils'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import { EntityDTOInterceptor } from '@sneusers/interceptors'
import { LocalAuthGuard } from '@sneusers/subdomains/auth/guards'
import { LoginRequest } from '@sneusers/subdomains/auth/interfaces'
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

  @UseGuards(LocalAuthGuard)
  @Post(OPENAPI.login.path)
  @HttpCode(OPENAPI.login.status)
  @ApiBody(OPENAPI.login.body)
  @ApiOkResponse(OPENAPI.login.responses[200])
  @ApiUnauthorizedResponse(OPENAPI.login.responses[401])
  @ApiInternalServerErrorResponse(OPENAPI.login.responses[500])
  @ApiBadGatewayResponse(OPENAPI.login.responses[502])
  async login(@Request() req: LoginRequest): Promise<UserDTO> {
    return req.user as UserDTO
  }

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
