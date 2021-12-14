// ! Remove NODE_OPTIONS (hangs on 'Webpack is building your sources' otherwise)
Reflect.deleteProperty(process.env, 'NODE_OPTIONS')

import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import configuration from '@sneusers/config/configuration'
import EnvironmentVariables from '@sneusers/models/environment-variables.model'
import tsTransformPaths from '@zerollup/ts-transform-paths'
import path from 'path'
import resolve from 'resolve-from'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { CustomTransformers, Program } from 'typescript'
import { Configuration } from 'webpack'
import { merge as mergeWebpack } from 'webpack-merge'

/**
 * @file NestJS Custom Webpack Configuration
 * @see https://docs.nestjs.com/cli/monorepo#webpack-options
 */

/** @property {EnvironmentVariables} ENV - Validated environment variables */
const ENV: EnvironmentVariables = configuration()

/** @property {string[]} EXTENSIONS - Resolvable file extensions */
const EXTENSIONS: string[] = ['.cjs', '.js', '.json', '.ts']

/** @property {string} TS_NODE_PROJECT - Path to tsconfig file */
const TS_NODE_PROJECT: string = './tsconfig.app.json'

/**
 * Alters the native NestJS webpack configuration.
 *
 * @param {Configuration} config - Default NestJS webpack configuration
 * @return {Configuration} Updated webpack configuration
 */
const config = (config: Configuration): Configuration => {
  // Set context and mode
  config.context = process.cwd()
  config.mode = ENV.NODE_ENV === NodeEnv.TEST ? 'none' : ENV.NODE_ENV

  // Override resolve options
  config.resolve = {
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

  // Remove TypeScript rule
  config.module && Reflect.deleteProperty(config.module, 'rules')

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
          resolve: {
            extensions: config.resolve.extensions,
            fullySpecified: false
          },
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
      nodeEnv: ENV.NODE_ENV,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      sideEffects: 'flag',
      usedExports: true
    },
    output: { clean: true },
    performance: {
      hints: 'warning'
    }
  })
}

export = config
