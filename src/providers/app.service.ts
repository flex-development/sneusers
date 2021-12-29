import { HttpStatus, Injectable, NestApplicationOptions } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * @file Providers - AppService
 * @module sneusers/providers/AppService
 */

@Injectable()
export default class AppService {
  constructor(protected readonly config: ConfigService) {}

  /**
   * Returns the options used to create the NestJS application.
   *
   * @static
   * @return {NestApplicationOptions} NestJS application options
   */
  static get options(): NestApplicationOptions {
    return {
      cors: {
        allowedHeaders: '*',
        methods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST'],
        optionsSuccessStatus: HttpStatus.ACCEPTED,
        origin: '*',
        preflightContinue: true
      }
    }
  }
}
