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
    DB_AUTO_LOAD_MODELS,
    DB_HOST,
    DB_LOG_QUERY_PARAMS,
    DB_LOGGING,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_TIMEZONE,
    DB_USERNAME,
    HOST,
    HOSTNAME,
    PORT,
    SSL_CERT,
    SSL_KEY,
    SSL_PASSPHRASE
  } = secrets({
    config: NODE_ENV,
    log_secrets: JSON.parse(process.env.WEBPACK_LOG_SECRETS || 'false')
  })

  return mergeWebpack(config, {
    module: {
      rules: [
        {
          test: /.ts?$/,
          exclude: /node_modules/,
          include: [
            path.join(config.context, '__tests__'),
            path.join(config.context, 'src'),
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
        'process.env.DB_AUTO_LOAD_MODELS': JSON.stringify(DB_AUTO_LOAD_MODELS),
        'process.env.DB_HOST': JSON.stringify(DB_HOST),
        'process.env.DB_LOG_QUERY_PARAMS': JSON.stringify(DB_LOG_QUERY_PARAMS),
        'process.env.DB_LOGGING': JSON.stringify(DB_LOGGING),
        'process.env.DB_NAME': JSON.stringify(DB_NAME),
        'process.env.DB_PASSWORD': JSON.stringify(DB_PASSWORD),
        'process.env.DB_PORT': JSON.stringify(DB_PORT),
        'process.env.DB_TIMEZONE': JSON.stringify(DB_TIMEZONE),
        'process.env.DB_USERNAME': JSON.stringify(DB_USERNAME),
        'process.env.HOST': JSON.stringify(HOST),
        'process.env.HOSTNAME': JSON.stringify(HOSTNAME),
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.PORT': JSON.stringify(PORT),
        'process.env.SSL_CERT': JSON.stringify(SSL_CERT),
        'process.env.SSL_KEY': JSON.stringify(SSL_KEY),
        'process.env.SSL_PASSPHRASE': JSON.stringify(SSL_PASSPHRASE)
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
