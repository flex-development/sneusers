import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import tsTransformPaths from '@zerollup/ts-transform-paths'
import path from 'path'
import resolve from 'resolve-from'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { CustomTransformers, Program } from 'typescript'
import type { ModuleOptions } from 'webpack'
import { Configuration, DefinePlugin } from 'webpack'
import { merge as mergeWebpack } from 'webpack-merge'
import secrets from './tools/helpers/secrets'

/**
 * @file NestJS Custom Webpack Configuration
 * @see https://docs.nestjs.com/cli/monorepo#webpack-options
 */

/** @property {string[]} EXTENSIONS - Resolvable file extensions */
const EXTENSIONS: string[] = ['.cjs', '.js', '.json', '.ts']

/** @property {NodeEnv} NODE_ENV - Node environment */
const NODE_ENV: NodeEnv = (process.env.NODE_ENV || NodeEnv.DEV) as NodeEnv

/** @property {string} TS_NODE_PROJECT - Path to tsconfig file */
const TS_NODE_PROJECT: string = `${process.cwd()}/tsconfig.app.json`

/**
 * Alters the native NestJS webpack configuration.
 *
 * @param {Configuration} config - Default NestJS webpack configuration
 * @return {Configuration} Enhanced webpack configuration
 */
const config = (config: Configuration): Configuration => {
  // Remove NestJS defaults
  Reflect.deleteProperty(config, 'resolve')
  Reflect.deleteProperty(config.module as ModuleOptions, 'rules')

  // Set context and mode
  config.context = process.cwd()
  config.mode = NODE_ENV === NodeEnv.TEST ? 'none' : NODE_ENV

  // Get application environment variables
  const {
    CACHE_MAX,
    CACHE_TTL,
    DB_AUTO_LOAD_MODELS,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    EMAIL_CLIENT,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_PRIVATE_KEY,
    EMAIL_SEND_AS,
    EMAIL_USER,
    HOST,
    HOSTNAME,
    JWT_EXP_ACCESS,
    JWT_EXP_REFRESH,
    JWT_EXP_VERIFY,
    JWT_SECRET_ACCESS,
    JWT_SECRET_REFRESH,
    JWT_SECRET_VERIFY,
    PORT,
    REDIS_HOST,
    REDIS_PORT,
    THROTTLE_LIMIT,
    THROTTLE_TTL
  } = secrets({ log: JSON.parse(process.env.WEBPACK_LOG_SECRETS || 'false') })

  return mergeWebpack(config, {
    module: {
      rules: [
        {
          test: /.ts?$/,
          exclude: /node_modules/,
          include: [
            path.join(config.context, '__doubles__'),
            path.join(config.context, '__tests__'),
            path.join(config.context, 'src'),
            path.join(config.context, 'tools', 'helpers', 'secrets.ts'),
            path.join(config.context, 'webpack.config.ts')
          ],
          resolve: { extensions: EXTENSIONS, fullySpecified: false },
          use: {
            loader: resolve(config.context, 'ts-loader'),
            options: {
              colors: true,
              configFile: TS_NODE_PROJECT,
              getCustomTransformers(program: Program): CustomTransformers {
                const transformer = tsTransformPaths(program)

                const afterDeclarations = [transformer.afterDeclarations]
                const before = [transformer.before]

                return {
                  afterDeclarations: afterDeclarations.filter(Boolean),
                  before: before.filter(Boolean)
                } as CustomTransformers
              },
              onlyCompileBundledFiles: true,
              transpileOnly: true,
              useCaseSensitiveFileNames: true
            }
          }
        }
      ]
    },
    optimization: {
      concatenateModules: true,
      emitOnErrors: false,
      mangleExports: true,
      mergeDuplicateChunks: true,
      minimize: config.mode === NodeEnv.PROD,
      nodeEnv: NODE_ENV,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      sideEffects: 'flag',
      usedExports: true
    },
    output: { clean: true },
    performance: {
      hints: 'warning'
    },
    plugins: [
      new DefinePlugin({
        'process.env.CACHE_MAX': JSON.stringify(CACHE_MAX),
        'process.env.CACHE_TTL': JSON.stringify(CACHE_TTL),
        'process.env.DB_AUTO_LOAD_MODELS': JSON.stringify(DB_AUTO_LOAD_MODELS),
        'process.env.DB_HOST': JSON.stringify(DB_HOST),
        'process.env.DB_NAME': JSON.stringify(DB_NAME),
        'process.env.DB_PASSWORD': JSON.stringify(DB_PASSWORD),
        'process.env.DB_PORT': JSON.stringify(DB_PORT),
        'process.env.DB_USERNAME': JSON.stringify(DB_USERNAME),
        'process.env.EMAIL_CLIENT': JSON.stringify(EMAIL_CLIENT),
        'process.env.EMAIL_HOST': JSON.stringify(EMAIL_HOST),
        'process.env.EMAIL_PORT': JSON.stringify(EMAIL_PORT),
        'process.env.EMAIL_PRIVATE_KEY': JSON.stringify(EMAIL_PRIVATE_KEY),
        'process.env.EMAIL_SEND_AS': JSON.stringify(EMAIL_SEND_AS),
        'process.env.EMAIL_USER': JSON.stringify(EMAIL_USER),
        'process.env.HOST': JSON.stringify(HOST),
        'process.env.HOSTNAME': JSON.stringify(HOSTNAME),
        'process.env.JWT_EXP_ACCESS': JSON.stringify(JWT_EXP_ACCESS),
        'process.env.JWT_EXP_REFRESH': JSON.stringify(JWT_EXP_REFRESH),
        'process.env.JWT_EXP_VERIFY': JSON.stringify(JWT_EXP_VERIFY),
        'process.env.JWT_SECRET_ACCESS': JSON.stringify(JWT_SECRET_ACCESS),
        'process.env.JWT_SECRET_REFRESH': JSON.stringify(JWT_SECRET_REFRESH),
        'process.env.JWT_SECRET_VERIFY': JSON.stringify(JWT_SECRET_VERIFY),
        'process.env.REDIS_HOST': JSON.stringify(REDIS_HOST),
        'process.env.REDIS_PORT': JSON.stringify(REDIS_PORT),
        'process.env.THROTTLE_LIMIT': JSON.stringify(THROTTLE_LIMIT),
        'process.env.THROTTLE_TTL': JSON.stringify(THROTTLE_TTL),
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.PORT': JSON.stringify(PORT)
      })
    ],
    resolve: {
      extensions: EXTENSIONS,
      plugins: [
        new TsconfigPathsPlugin({
          baseUrl: config.context,
          configFile: TS_NODE_PROJECT,
          context: config.context,
          extensions: EXTENSIONS,
          logInfoToStdOut: false,
          logLevel: 'WARN',
          silent: false
        })
      ]
    }
  })
}

export = config
