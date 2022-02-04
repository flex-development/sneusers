import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { ApiPaginatedResponse } from '@sneusers/decorators'
import type { PaginatedDTO } from '@sneusers/dtos'
import { EntitySerializer, HttpCacheInterceptor } from '@sneusers/interceptors'
import { QueryParams } from '@sneusers/models'
import { CsrfTokenAuth } from '@sneusers/subdomains/auth/decorators'
import { UserAuth } from '@sneusers/subdomains/users/decorators'
import { PatchUserDTO, UserDTO } from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import { EmailVerificationGuard } from '@sneusers/subdomains/users/guards'
import { UserInterceptor } from '@sneusers/subdomains/users/interceptors'
import { IUser } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import type { OrPaginated } from '@sneusers/types'
import OPENAPI from './openapi/users.openapi'

/**
 * @file Users Subdomain Controllers - UsersController
 * @module sneusers/subdomains/users/controllers/UsersController
 */

type Serialized = OrPaginated<IUser>

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntitySerializer<User, Serialized>())
@UseInterceptors(new UserInterceptor<Serialized, OrPaginated<UserDTO>>())
@UseInterceptors(HttpCacheInterceptor)
export default class UsersController {
  constructor(protected readonly users: UsersService) {}

  @Delete(':uid')
  @UserAuth()
  @CsrfTokenAuth()
  @HttpCode(OPENAPI.delete.status)
  @ApiNoContentResponse(OPENAPI.delete.responses[204])
  @ApiNotFoundResponse(OPENAPI.delete.responses[404])
  @ApiInternalServerErrorResponse(OPENAPI.delete.responses[500])
  @ApiBadGatewayResponse(OPENAPI.delete.responses[502])
  async delete(
    @Param('uid') uid: IUser['email'] | IUser['id']
  ): Promise<UserDTO> {
    return await this.users.remove(uid)
  }

  @Get()
  @CacheTTL(120)
  @HttpCode(OPENAPI.find.status)
  @ApiQuery(OPENAPI.find.query)
  @ApiPaginatedResponse(UserDTO, OPENAPI.find.responses[200])
  @ApiBadRequestResponse(OPENAPI.find.responses[400])
  @ApiInternalServerErrorResponse(OPENAPI.find.responses[500])
  @ApiBadGatewayResponse(OPENAPI.find.responses[502])
  async find(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryParams<User> = {}
  ): Promise<PaginatedDTO<UserDTO>> {
    return await this.users.find(this.users.getSearchOptions(query))
  }

  @Get(':uid')
  @CacheTTL(120)
  @HttpCode(OPENAPI.findOne.status)
  @ApiQuery(OPENAPI.findOne.query)
  @ApiOkResponse(OPENAPI.findOne.responses[200])
  @ApiBadRequestResponse(OPENAPI.findOne.responses[400])
  @ApiNotFoundResponse(OPENAPI.findOne.responses[404])
  @ApiInternalServerErrorResponse(OPENAPI.findOne.responses[500])
  @ApiBadGatewayResponse(OPENAPI.findOne.responses[502])
  async findOne(
    @Param('uid') uid: IUser['email'] | IUser['id'],
    @Query(new ValidationPipe({ transform: true }))
    query: QueryParams<User> = {}
  ): Promise<UserDTO> {
    return (await this.users.findOne(
      uid,
      this.users.getSearchOptions({ ...query, rejectOnEmpty: true })
    )) as UserDTO
  }

  @Patch(':uid')
  @UseGuards(EmailVerificationGuard)
  @UserAuth()
  @CsrfTokenAuth()
  @HttpCode(OPENAPI.patch.status)
  @ApiCreatedResponse(OPENAPI.patch.responses[200])
  @ApiBadRequestResponse(OPENAPI.patch.responses[400])
  @ApiNotFoundResponse(OPENAPI.patch.responses[404])
  @ApiConflictResponse(OPENAPI.patch.responses[409])
  @ApiInternalServerErrorResponse(OPENAPI.patch.responses[500])
  @ApiBadGatewayResponse(OPENAPI.patch.responses[502])
  async patch(
    @Param('uid') uid: IUser['email'] | IUser['id'],
    @Body(new ValidationPipe({ transform: true })) dto: PatchUserDTO
  ): Promise<UserDTO> {
    return await this.users.patch(uid, dto)
  }
}
