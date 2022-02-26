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
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiResponses,
  ApiTokenAuth
} from '@sneusers/decorators'
import { PaginatedDTO } from '@sneusers/dtos'
import { HttpCacheInterceptor } from '@sneusers/interceptors'
import { QueryParams } from '@sneusers/models'
import { EntitySerializer } from '@sneusers/modules/db/interceptors'
import { JwtAuthGuard } from '@sneusers/subdomains/auth/guards'
import type { OrPaginated } from '@sneusers/types'
import { PatchUserDTO, UserDTO } from '../dtos'
import { User } from '../entities'
import { EmailVerificationGuard } from '../guards'
import { UserInterceptor } from '../interceptors'
import type { IUser } from '../interfaces'
import { UsersService } from '../providers'
import { UserUid } from '../types'
import OPENAPI from './openapi/users.openapi'

/**
 * @file Users Subdomain Controllers - UsersController
 * @module sneusers/subdomains/users/controllers/UsersController
 */

type Serialized = OrPaginated<IUser>

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntitySerializer<User, OrPaginated<User>, Serialized>())
@UseInterceptors(new UserInterceptor<Serialized, OrPaginated<UserDTO>>())
@UseInterceptors(HttpCacheInterceptor)
export default class UsersController {
  constructor(protected readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(OPENAPI.delete.path)
  @HttpCode(OPENAPI.delete.status)
  @ApiTokenAuth()
  @ApiResponses(OPENAPI.delete.responses)
  async delete(@Param('uid') uid: UserUid): Promise<UserDTO> {
    return this.users.remove(uid)
  }

  @CacheTTL(120)
  @Get(OPENAPI.find.path)
  @HttpCode(OPENAPI.find.status)
  @ApiQuery(OPENAPI.find.query)
  @ApiResponses(OPENAPI.find.responses)
  @ApiPaginatedResponse(UserDTO, OPENAPI.find.responses[200])
  async find(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryParams<User> = {}
  ): Promise<PaginatedDTO<UserDTO>> {
    return this.users.find(this.users.getSearchOptions(query))
  }

  @CacheTTL(120)
  @Get(OPENAPI.findOne.path)
  @HttpCode(OPENAPI.findOne.status)
  @ApiQuery(OPENAPI.findOne.query)
  @ApiResponses(OPENAPI.findOne.responses)
  async findOne(
    @Param('uid') uid: UserUid,
    @Query(new ValidationPipe({ transform: true }))
    query: QueryParams<User> = {}
  ): Promise<UserDTO> {
    return (await this.users.findOne(
      uid,
      this.users.getSearchOptions({ ...query, rejectOnEmpty: true })
    ))!
  }

  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(OPENAPI.patch.path)
  @HttpCode(OPENAPI.patch.status)
  @ApiTokenAuth()
  @ApiResponses(OPENAPI.patch.responses)
  async patch(
    @Param('uid') uid: UserUid,
    @Body(new ValidationPipe({ transform: true })) dto: PatchUserDTO
  ): Promise<UserDTO> {
    return this.users.patch(uid, dto)
  }
}
