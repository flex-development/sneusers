import {
  Body,
  Controller,
  HttpCode,
  Post,
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
import type { EntityDTO } from '@sneusers/dtos'
import { EntitySerializer } from '@sneusers/interceptors'
import { LoginDTO } from '@sneusers/subdomains/auth/dtos'
import { LocalAuthGuard } from '@sneusers/subdomains/auth/guards'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import { AuthedUser } from '@sneusers/subdomains/users/decorators'
import { CreateUserDTO, UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import { PasswordInterceptor } from '@sneusers/subdomains/users/interceptors'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import OPENAPI from './openapi/auth.openapi'

/**
 * @file Auth Subdomain Controllers - AuthController
 * @module sneusers/subdomains/auth/controllers/AuthController
 */

type ResBody = LoginDTO | UserDTO

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntitySerializer<User, EntityDTO<IUser>>())
@UseInterceptors(new PasswordInterceptor<EntityDTO<IUser>, ResBody>())
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
  async login(@AuthedUser() user: User): Promise<LoginDTO> {
    return await this.auth.login(user)
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
    return await this.auth.register(dto)
  }
}
