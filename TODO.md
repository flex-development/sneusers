# Todo List

## v1.0.0-dev.0

- [x] Database Design
- [x] Repository Setup
  - [x] Doppler
  - [x] NestJS
    - [x] Project structure
    - [x] Configuration (environment variables)
  - [x] Docker
    - [x] Initial `.dockerignore`
    - [x] Initial `Dockerfile`
    - [x] Initial `docker-compose.yml`
- [x] Global exception filters and middleware
  - [x] Filters
    - [x] `ExceptionClassFilter`
    - [x] `HttpExceptionFilter`
  - [x] Middleware
    - [x] `HttpLoggerMiddleware`
- [x] [ORM Integration][1]
- [x] Users - Core CRUD & Business Logic
  - [x] `User`
  - [x] `UsersService`
  - [x] `UsersController`
- [ ] [Seed database][2]
- [x] [Authentication][3]
  - [x] Register users
  - [x] [Refresh tokens][4]
  - [x] [Email verification][5]
- [ ] Authorization
  - [ ] Require user email to be verified before performing delete or patch
- [x] Security
  - [x] [Helmet][6]
  - [x] [CORS][7]
  - [x] [CSRF Protection][8]
  - [x] [Rate Limiting][9]
- [x] Performce Improvements
  - [x] [Caching][10]
  - [x] [Compression][11]
  - [x] Database Indices
  - [x] Pagination
- [ ] [API Versioning][12]
- [x] [Healthchecks][13]
- [x] Docker Compose
  - [x] `docker-compose.yml` qa
  - [x] Add `docker-cloud.yml` for staging environment
- [x] Virtual Machine - Staging
  - [x] [Setup][14]
  - [x] Deploy
    - [x] API
    - [x] Adminer
    - [x] Redis
  - [x] [SSL QA][15]
- [x] QA - Documentation
  - [x] `CONTRIBUTING`
  - [x] [`DATABASE`](docs/DATABASE.dbml)
  - [x] `README`
  - [x] OpenAPI

## v1.0.0

- [ ] [Events][16]
- [ ] [Handle CPU-intensive tasks with queues][17]
- [ ] [Database Migrations][18]
- [ ] Docker Compose
  - [ ] `docker-cloud.yml` qa (production environment)
- [ ] Virtual Machine - Production
  - [ ] [Setup][14]
  - [ ] Deploy
    - [ ] API
    - [ ] Adminer
    - [ ] Redis
  - [ ] [SSL QA][15]

[1]: https://docs.nestjs.com/techniques/database#sequelize-integration
[2]: https://sequelize.org/v7/manual/migrations.html#creating-the-first-seed
[3]: https://docs.nestjs.com/security/authentication
[4]: https://wanago.io/2020/09/21/api-nestjs-refresh-tokens-jwt
[5]: https://wanago.io/2021/07/12/api-nestjs-confirming-email
[6]: https://docs.nestjs.com/security/helmet
[7]: https://docs.nestjs.com/security/cors
[8]: https://docs.nestjs.com/security/csrf
[9]: https://docs.nestjs.com/security/rate-limiting
[10]: https://docs.nestjs.com/techniques/caching
[11]: https://docs.nestjs.com/techniques/compression
[12]: https://docs.nestjs.com/techniques/versioning#uri-versioning-type
[13]: https://docs.nestjs.com/recipes/terminus
[14]: https://gist.github.com/unicornware/34d6f4678232ee4bd99cad861209577b
[15]: https://ssllabs.com/ssltest
[16]: https://docs.nestjs.com/techniques/events
[17]: https://wanago.io/2021/05/03/api-nestjs-cpu-intensive-tasks-queues
[18]: https://sequelize.org/v7/manual/migrations
