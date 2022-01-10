import type { OneOrMany } from '@flex-development/tutils'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
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
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import { EntityDTOInterceptor } from '@sneusers/interceptors'
import { QueryParams } from '@sneusers/models'
import {
  CreateUserDTO,
  PatchUserDTO,
  UserDTO
} from '@sneusers/subdomains/users/dtos'
import type { User } from '@sneusers/subdomains/users/entities'
import { PasswordInterceptor } from '@sneusers/subdomains/users/interceptors'
import { IUser } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import OPENAPI from './openapi/users.openapi'

/**
 * @file Users Subdomain Controllers - UsersController
 * @module sneusers/subdomains/controllers/users/UsersController
 */

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntityDTOInterceptor<User, OneOrMany<UserDTO>>())
@UseInterceptors(PasswordInterceptor)
export default class UsersController {
  constructor(protected readonly users: UsersService) {}

  @Post()
  @HttpCode(OPENAPI.create.status)
  @ApiCreatedResponse(OPENAPI.create.responses[201])
  @ApiBadRequestResponse(OPENAPI.create.responses[400])
  @ApiConflictResponse(OPENAPI.create.responses[409])
  @ApiUnprocessableEntityResponse(OPENAPI.create.responses[422])
  @ApiInternalServerErrorResponse(OPENAPI.create.responses[500])
  @ApiBadGatewayResponse(OPENAPI.create.responses[502])
  async create(
    @Body(new ValidationPipe({ forbidUnknownValues: true })) dto: CreateUserDTO
  ): Promise<UserDTO> {
    return (await this.users.create(dto)) as UserDTO
  }

  @Delete(':uid')
  @HttpCode(OPENAPI.delete.status)
  @ApiNoContentResponse(OPENAPI.delete.responses[204])
  @ApiUnauthorizedResponse(OPENAPI.delete.responses[401])
  @ApiNotFoundResponse(OPENAPI.delete.responses[404])
  @ApiInternalServerErrorResponse(OPENAPI.delete.responses[500])
  @ApiBadGatewayResponse(OPENAPI.delete.responses[502])
  async delete(
    @Param('uid') uid: IUser['email'] | IUser['id']
  ): Promise<UserDTO> {
    return (await this.users.remove(uid)) as UserDTO
  }

  @Get()
  @HttpCode(OPENAPI.find.status)
  @ApiQuery(OPENAPI.find.query)
  @ApiOkResponse(OPENAPI.find.responses[200])
  @ApiBadRequestResponse(OPENAPI.find.responses[400])
  @ApiInternalServerErrorResponse(OPENAPI.find.responses[500])
  @ApiBadGatewayResponse(OPENAPI.find.responses[502])
  async find(@Query() query: QueryParams<IUser> = {}): Promise<UserDTO[]> {
    return (await this.users.find(
      this.users.repo.buildSearchOptions(query)
    )) as UserDTO[]
  }

  @Get(':uid')
  @HttpCode(OPENAPI.findOne.status)
  @ApiQuery(OPENAPI.findOne.query)
  @ApiOkResponse(OPENAPI.findOne.responses[200])
  @ApiBadRequestResponse(OPENAPI.findOne.responses[400])
  @ApiNotFoundResponse(OPENAPI.findOne.responses[404])
  @ApiInternalServerErrorResponse(OPENAPI.findOne.responses[500])
  @ApiBadGatewayResponse(OPENAPI.findOne.responses[502])
  async findOne(
    @Param('uid') uid: IUser['email'] | IUser['id'],
    @Query() query: QueryParams<IUser> = {}
  ): Promise<UserDTO> {
    return (await this.users.findOne(
      uid,
      this.users.repo.buildSearchOptions({ ...query, rejectOnEmpty: true })
    )) as UserDTO
  }

  @Patch(':uid')
  @HttpCode(OPENAPI.patch.status)
  @ApiCreatedResponse(OPENAPI.patch.responses[200])
  @ApiBadRequestResponse(OPENAPI.patch.responses[400])
  @ApiUnauthorizedResponse(OPENAPI.patch.responses[401])
  @ApiNotFoundResponse(OPENAPI.patch.responses[404])
  @ApiConflictResponse(OPENAPI.patch.responses[409])
  @ApiInternalServerErrorResponse(OPENAPI.patch.responses[500])
  @ApiBadGatewayResponse(OPENAPI.patch.responses[502])
  async patch(
    @Param('uid') uid: IUser['email'] | IUser['id'],
    @Body(new ValidationPipe({ forbidUnknownValues: true })) dto: PatchUserDTO
  ): Promise<UserDTO> {
    return (await this.users.patch(uid, dto)) as UserDTO
  }
}
