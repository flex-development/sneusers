import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiResponses, ApiTokenAuth } from '@sneusers/decorators'
import type { EntityDTO } from '@sneusers/dtos'
import { EntitySerializer } from '@sneusers/interceptors'
import { CurrentUser } from '@sneusers/subdomains/users/decorators'
import { UserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UserInterceptor } from '@sneusers/subdomains/users/interceptors'
import type { IUser } from '@sneusers/subdomains/users/interfaces'
import {
  RequestVerifDTO,
  RequestVerifResendDTO,
  VerifEmailSentDTO
} from '../dtos'
import { JwtAuthGuard } from '../guards'
import { VerificationService } from '../providers'
import OPENAPI from './openapi/verification.openapi'

/**
 * @file Auth Subdomain Controllers - VerificationController
 * @module sneusers/subdomains/auth/controllers/VerificationController
 */

type Stream = User | VerifEmailSentDTO
type Serialized = EntityDTO<IUser> | VerifEmailSentDTO

@Controller(OPENAPI.controller)
@ApiTags(...OPENAPI.tags)
@UseInterceptors(new EntitySerializer<User, Stream, Serialized>())
@UseInterceptors(new UserInterceptor<Serialized, UserDTO | VerifEmailSentDTO>())
export default class VerificationController {
  constructor(protected readonly verification: VerificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post(OPENAPI.resend.path)
  @HttpCode(OPENAPI.resend.status)
  @ApiTokenAuth()
  @ApiQuery(OPENAPI.resend.query)
  @ApiResponses(OPENAPI.resend.responses)
  async resend(
    @CurrentUser() user: User,
    @Query(new ValidationPipe({ transform: true })) query: RequestVerifResendDTO
  ): Promise<VerifEmailSentDTO> {
    return await this.verification.resend(user.id, query)
  }

  @Get(OPENAPI.verify.path)
  @HttpCode(OPENAPI.verify.status)
  @ApiQuery(OPENAPI.verify.query)
  @ApiResponses(OPENAPI.verify.responses)
  async verify(
    @Query(new ValidationPipe({ transform: true })) query: RequestVerifDTO
  ): Promise<UserDTO> {
    return await this.verification.verify(query)
  }
}
