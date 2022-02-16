import type { OrUndefined } from '@flex-development/tutils'
import { ClassProvider, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitterOptions } from '@sneusers/abstracts'
import type { EnvironmentVariables } from '@sneusers/models'
import { REDIS_CLIENT } from '@sneusers/modules/redis/redis.constants'
import { RedisClient } from '@sneusers/modules/redis/types'
import RedisStore, { RedisStoreOptions } from 'connect-redis'
import session, { MemoryStore } from 'express-session'
import { SessionOptions } from '../abstracts'
import { CookieType, SessionUnset } from '../enums'
import { CookieOptionsFactory, SessionOptionsFactory } from '../factories'

/**
 * @file MiddlewareModule Providers - SessionConfigService
 * @module sneusers/modules/middleware/providers/SessionConfigService
 */

@Injectable()
class SessionConfigService implements SessionOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly cookie: CookieOptionsFactory,
    @Inject(REDIS_CLIENT) protected readonly redis: RedisClient
  ) {}

  /**
   * Creates a {@link SessionOptionsFactory} provider.
   *
   * @static
   * @return {ClassProvider<SessionOptionsFactory>} Class provider
   */
  static createProvider(): ClassProvider<SessionOptionsFactory> {
    return { provide: SessionOptionsFactory, useClass: SessionConfigService }
  }

  /**
   * Get [`session`][1] options.
   *
   * [1]: https://github.com/expressjs/session
   *
   * @return {SessionOptions} `session` options
   */
  createSessionOptions(): SessionOptions {
    return {
      cookie: this.cookie.createOptions(CookieType.SESSION),
      name: this.config.get<string>('SESSION_NAME'),
      proxy: this.config.get<OrUndefined<boolean>>('SESSION_PROXY'),
      resave: this.config.get<boolean>('SESSION_RESAVE'),
      rolling: this.config.get<boolean>('SESSION_ROLLING'),
      saveUninitialized: this.config.get<boolean>('SESSION_SAVE_UNINITIALIZED'),
      secret: this.config.get<string>('SESSION_SECRET'),
      store: this.createStore(),
      unset: this.config.get<SessionUnset>('SESSION_UNSET')
    }
  }

  /**
   * Returns the [`session`][1] middleware routing configuration.
   *
   * [1]: https://github.com/expressjs/session
   *
   * @see https://docs.nestjs.com/middleware
   *
   * @return {string} Routing configuration
   */
  createSessionRoutes(): string[] {
    return ['*']
  }

  /**
   * Creates a session store.
   *
   * @return {MemoryStore | RedisStore.RedisStore} Memory or redis session store
   */
  createStore(): RedisStore.RedisStore | MemoryStore {
    const options = this.createStoreOptions()

    if (this.config.get<boolean>('TEST')) {
      return new MemoryStore(options as EventEmitterOptions)
    }

    return new (RedisStore(session))(options as RedisStoreOptions)
  }

  /**
   * Creates session store options.
   *
   * @return {EventEmitterOptions | RedisStoreOptions} Session store options
   */
  createStoreOptions(): EventEmitterOptions | RedisStoreOptions {
    if (this.config.get<boolean>('TEST')) return { captureRejections: true }

    return {
      client: this.redis as unknown as RedisStoreOptions['client'],
      logErrors: true
    }
  }
}

export default SessionConfigService
