/**
 * @file Configuration - Build
 * @module config/build
 * @see https://github.com/flex-development/mkbuild
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import pkg from './package.json' assert { type: 'json' }
import tsconfig from './tsconfig.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  bundle: true,
  conditions: tsconfig.compilerOptions.customConditions,
  external: [
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
    'class-transformer/storage'
  ],
  loader: { '.conf': 'text', '.template': 'text', '.types': 'text' },
  platform: 'node',
  source: 'src/main.ts',
  sourcemap: true,
  sourcesContent: false,
  target: 'node' + pkg.engines.node.replace(/^\D+/, ''),
  tsconfig: 'tsconfig.build.json'
})

export default config
