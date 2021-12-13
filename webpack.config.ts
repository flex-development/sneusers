// Remove NODE_OPTIONS
delete process.env.NODE_OPTIONS

import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import isNodeEnv from '@flex-development/tutils/guards/is-node-env.guard'
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

/**
 * Alters the native NestJS webpack configuration.
 *
 * @param {Configuration} config - Default NestJS webpack configuration
 * @return {Configuration} Updated webpack configuration
 */
const config = (config: Configuration): Configuration => {
  // Get Node environment
  let NODE_ENV = process.env.NODE_ENV as NodeEnv
  NODE_ENV = (isNodeEnv(NODE_ENV) && NODE_ENV) || NodeEnv.DEV

  // Set context and mode
  config.context = process.cwd()
  config.mode = NODE_ENV === NodeEnv.TEST ? 'none' : NODE_ENV

  // Get path to tsconfig file
  const TS_NODE_PROJECT = `${config.context}/tsconfig.app.json`

  // Get resolvable extensions
  const extensions = ['.cjs', '.js', '.json', '.ts']

  // Override resolve options
  config.resolve = {
    extensions,
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: config.context,
        configFile: TS_NODE_PROJECT,
        context: config.context,
        extensions,
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
          // eslint-disable-next-line sort-keys
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
              getCustomTransformers(prog: Program): CustomTransformers {
                const transformer = tsTransformPaths(prog)

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
      minimize: config.mode === 'production',
      nodeEnv: NODE_ENV,
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
