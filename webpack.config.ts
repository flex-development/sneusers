import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import tsTransformPaths from '@kadeluxe/ts-transform-paths'
import path from 'path'
import resolve from 'resolve-from'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { CustomTransformers, Program } from 'typescript'
import type { ModuleOptions } from 'webpack'
import { Configuration } from 'webpack'
import { merge as mergeWebpack } from 'webpack-merge'

/**
 * @file NestJS Custom Webpack Configuration
 * @see https://docs.nestjs.com/cli/monorepo#webpack-options
 */

/** @property {string[]} EXTENSIONS - Resolvable file extensions */
const EXTENSIONS: string[] = ['.cjs', '.js', '.json', '.ts']

/** @property {NodeEnv} NODE_ENV - Node environment */
const NODE_ENV: NodeEnv = (process.env.NODE_ENV || NodeEnv.DEV) as NodeEnv

/** @property {string} TSCONFIG - Project tsconfig file */
const TSCONFIG: string = 'tsconfig.app.json'

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
            path.join(config.context, 'webpack.config.ts')
          ],
          use: {
            loader: resolve(config.context, 'ts-loader'),
            options: {
              colors: true,
              configFile: `${config.context}/${TSCONFIG}`,
              getCustomTransformers(program: Program): CustomTransformers {
                const transformer = tsTransformPaths(program)

                return {
                  afterDeclarations: [transformer.afterDeclarations],
                  before: [transformer.before]
                } as CustomTransformers
              },
              ignoreDiagnostics: [2589],
              logInfoToStdOut: true,
              logLevel: 'error',
              onlyCompileBundledFiles: false,
              transpileOnly: false,
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
    output: {
      clean: true
    },
    performance: {
      hints: 'warning'
    },
    resolve: {
      extensions: EXTENSIONS,
      fullySpecified: false,
      plugins: [
        new TsconfigPathsPlugin({
          baseUrl: config.context,
          configFile: TSCONFIG,
          context: config.context,
          extensions: EXTENSIONS,
          logInfoToStdOut: true,
          logLevel: 'ERROR',
          silent: false
        })
      ]
    }
  })
}

export = config
