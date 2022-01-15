import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import type { EntityDTO } from '@sneusers/dtos'
import { EntitySerializer } from '@sneusers/interceptors'
import { CsurfMiddleware } from '@sneusers/middleware'
import { CsrfToken, CsrfTokenAuth } from '@sneusers/subdomains/auth/decorators'
import { LoginDTO } from '@sneusers/subdomains/auth/dtos'
import {
  JwtRefreshGuard,
  LocalAuthGuard
} from '@sneusers/subdomains/auth/guards'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import { AuthedUser, UserAuth } from '@sneusers/subdomains/users/decorators'
import { CreateUserDTO, UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import { PasswordInterceptor } from '@sneusers/subdomains/users/interceptors'
import type { IUser, UserRequest } from '@sneusers/subdomains/users/interfaces'
import { Response } from 'express'
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
  @CsrfTokenAuth()
  @Post(OPENAPI.login.path)
  @HttpCode(OPENAPI.login.status)
  @ApiBody(OPENAPI.login.body)
  @ApiOkResponse(OPENAPI.login.responses[200])
  @ApiUnauthorizedResponse(OPENAPI.login.responses[401])
  @ApiInternalServerErrorResponse(OPENAPI.login.responses[500])
  @ApiBadGatewayResponse(OPENAPI.login.responses[502])
  async login(
    @AuthedUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginDTO> {
    res.setHeader('Set-Cookie', await this.auth.cookieWithRefreshToken(user))
    return await this.auth.login(user)
  }

  @CsrfTokenAuth()
  @UserAuth()
  @Post(OPENAPI.logout.path)
  @HttpCode(OPENAPI.logout.status)
  @ApiOkResponse(OPENAPI.logout.responses[200])
  @ApiInternalServerErrorResponse(OPENAPI.logout.responses[500])
  @ApiBadGatewayResponse(OPENAPI.logout.responses[502])
  async logout(
    @AuthedUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    res.setHeader('Set-Cookie', this.auth.cookiesForLogout())
    return user
  }

  @CsrfTokenAuth()
  @UseGuards(JwtRefreshGuard)
  @Get(OPENAPI.refresh.path)
  @HttpCode(OPENAPI.refresh.status)
  @ApiCookieAuth('Refresh')
  @ApiOkResponse(OPENAPI.refresh.responses[200])
  @ApiUnauthorizedResponse(OPENAPI.refresh.responses[401])
  @ApiInternalServerErrorResponse(OPENAPI.refresh.responses[500])
  @ApiBadGatewayResponse(OPENAPI.refresh.responses[502])
  async refresh(@Req() req: UserRequest): Promise<LoginDTO> {
    return await this.auth.refresh(req?.cookies?.Refresh ?? null)
  }

  @Post(OPENAPI.register.path)
  @HttpCode(OPENAPI.register.status)
  @ApiCreatedResponse(OPENAPI.register.responses[201])
  @ApiConflictResponse(OPENAPI.register.responses[409])
  @ApiUnprocessableEntityResponse(OPENAPI.register.responses[422])
  @ApiInternalServerErrorResponse(OPENAPI.register.responses[500])
  @ApiBadGatewayResponse(OPENAPI.register.responses[502])
  async register(
    @Body(new ValidationPipe({ forbidUnknownValues: true })) dto: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
    @CsrfToken('create') csrf_token: string
  ): Promise<UserDTO> {
    res.cookie('csrf-token', csrf_token, CsurfMiddleware.cookie())
    return await this.auth.register(dto)
  }
}
