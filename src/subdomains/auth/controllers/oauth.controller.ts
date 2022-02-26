import {
  Controller,
  Get,
  HttpCode,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiResponses } from '@sneusers/decorators'
import type { EntityDTO } from '@sneusers/modules/db/dtos'
import { EntitySerializer } from '@sneusers/modules/db/interceptors'
import { CookieType } from '@sneusers/modules/middleware/enums'
import { CookieOptionsFactory } from '@sneusers/modules/middleware/factories'
import { CurrentUser } from '@sneusers/subdomains/users/decorators'
import type { User } from '@sneusers/subdomains/users/entities'
import { UserInterceptor } from '@sneusers/subdomains/users/interceptors'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import { Response } from 'express'
import { LoginDTO } from '../dtos'
import { OAuthGuard } from '../guards'
import type { ILoginDTO } from '../interfaces'
import { AuthService } from '../providers'
import OPENAPI from './openapi/oauth.openapi'

/**
 * @file Auth Subdomain Controllers - OAuthController
 * @module sneusers/subdomains/auth/controllers/OAuthController
 */

type Serialized = EntityDTO<IUser> | ILoginDTO

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@ApiExtraModels(...OPENAPI.extraModels)
@UseInterceptors(new EntitySerializer<User, User | LoginDTO, Serialized>())
@UseInterceptors(new UserInterceptor<Serialized, ILoginDTO>())
export default class OAuthController {
  constructor(
    protected readonly auth: AuthService,
    protected readonly cookie: CookieOptionsFactory
  ) {}

  @UseGuards(OAuthGuard)
  @Get(OPENAPI.provider.path)
  @HttpCode(OPENAPI.provider.status)
  async provider(): Promise<void> {
    return // redirects
  }

  @UseGuards(OAuthGuard)
  @Get(OPENAPI.providerCallback.path)
  @HttpCode(OPENAPI.providerCallback.status)
  @ApiQuery(OPENAPI.providerCallback.query)
  @ApiResponses(OPENAPI.providerCallback.responses)
  async providerCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginDTO> {
    const [login, cookie] = await this.auth.login(user)

    res.cookie('Refresh', cookie, this.cookie.createOptions(CookieType.REFRESH))
    return login
  }
}
