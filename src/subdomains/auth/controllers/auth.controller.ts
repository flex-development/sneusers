import { OrNull } from '@flex-development/tutils'
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
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import {
  ApiCsrfProtection,
  ApiResponses,
  ApiTokenAuth,
  CsrfToken
} from '@sneusers/decorators'
import type { EntityDTO } from '@sneusers/dtos'
import { CookieType } from '@sneusers/enums'
import { EntitySerializer } from '@sneusers/interceptors'
import { CookieOptionsFactory } from '@sneusers/modules/middleware/factories'
import { CurrentUser } from '@sneusers/subdomains/users/decorators'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import { UserInterceptor } from '@sneusers/subdomains/users/interceptors'
import type { IUser, UserRequest } from '@sneusers/subdomains/users/interfaces'
import { Response } from 'express'
import { LoginDTO, RegisterUserDTO, WhoamiDTO } from '../dtos'
import {
  JwtAuthGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
  WhoamiGuard
} from '../guards'
import type { ILoginDTO } from '../interfaces'
import { AuthService } from '../providers'
import OPENAPI from './openapi/auth.openapi'

/**
 * @file Auth Subdomain Controllers - AuthController
 * @module sneusers/subdomains/auth/controllers/AuthController
 */

type Serialized = EntityDTO<IUser> | ILoginDTO
type Payload = ILoginDTO | UserDTO | WhoamiDTO

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntitySerializer<User, User | LoginDTO, Serialized>())
@UseInterceptors(new UserInterceptor<Serialized, Payload>())
export default class AuthController {
  constructor(
    protected readonly auth: AuthService,
    protected readonly cookie: CookieOptionsFactory
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post(OPENAPI.login.path)
  @HttpCode(OPENAPI.login.status)
  @ApiCsrfProtection()
  @ApiBody(OPENAPI.login.body)
  @ApiResponses(OPENAPI.login.responses)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginDTO> {
    const [login, cookie] = await this.auth.login(user)

    res.cookie('Refresh', cookie, this.cookie.createOptions(CookieType.REFRESH))
    return login
  }

  @UseGuards(JwtAuthGuard)
  @Post(OPENAPI.logout.path)
  @HttpCode(OPENAPI.logout.status)
  @ApiTokenAuth()
  @ApiResponses(OPENAPI.logout.responses)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    res.clearCookie('Refresh', this.cookie.createOptions(CookieType.LOGOUT))
    return user
  }

  @UseGuards(JwtRefreshGuard)
  @Post(OPENAPI.refresh.path)
  @HttpCode(OPENAPI.refresh.status)
  @ApiCsrfProtection()
  @ApiCookieAuth('Refresh')
  @ApiResponses(OPENAPI.refresh.responses)
  async refresh(@Req() req: UserRequest): Promise<LoginDTO> {
    return await this.auth.refresh(req.cookies.Refresh)
  }

  @Post(OPENAPI.register.path)
  @HttpCode(OPENAPI.register.status)
  @ApiBody(OPENAPI.register.body)
  @ApiResponses(OPENAPI.register.responses)
  async register(
    @Body(new ValidationPipe({ transform: true })) dto: RegisterUserDTO,
    @CsrfToken('create') cookie: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    res.cookie('csrf-token', cookie, this.cookie.createOptions(CookieType.CSRF))
    return await this.auth.register(dto)
  }

  @UseGuards(WhoamiGuard)
  @Get(OPENAPI.whoami.path)
  @HttpCode(OPENAPI.whoami.status)
  @ApiBearerAuth()
  @ApiResponses(OPENAPI.whoami.responses)
  async whoami(
    @CurrentUser() user: OrNull<User>,
    @CsrfToken('create') cookie: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<WhoamiDTO> {
    if (user) {
      const cookie_options = this.cookie.createOptions(CookieType.CSRF)
      res.cookie('csrf-token', cookie, cookie_options)
    }

    return user || {}
  }
}
