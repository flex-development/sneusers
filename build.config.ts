/**
 * @file Configuration - Build
 * @module config/build
 * @see https://github.com/flex-development/mkbuild
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import pkg from './package.json' assert { type: 'json' }
import tsconfig from './tsconfig.build.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  charset: 'utf8',
  dts: false,
  external: [
    '@mikro-orm/better-sqlite',
    '@mikro-orm/mariadb',
    '@mikro-orm/migrations-mongodb',
    '@mikro-orm/mysql',
    '@mikro-orm/postgresql',
    '@mikro-orm/seeder',
    '@mikro-orm/sqlite',
    '@nestjs/microservices',
    '@nestjs/mongoose',
    '@nestjs/sequelize',
    '@nestjs/typeorm',
    '@nestjs/websockets',
    'class-transformer/storage'
  ],
  ignore: ['**/interfaces/**', '**/types/**'],
  keepNames: true,
  platform: 'node',
  sourcemap: tsconfig.compilerOptions.sourceMap,
  sourcesContent: false,
  target: pkg.engines.node.replace(/^\D+/, 'node'),
  tsconfig: 'tsconfig.build.json'
})

export default config
