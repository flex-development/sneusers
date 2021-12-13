const { ExplicitParams } = require('tsconfig-paths/lib/config-loader')
const matchSpecifier = require('./match-specifier.cjs')
const { loadSync: tsconfig } = require('tsconfig/dist/tsconfig')

/**
 * @file Helpers - tsconfigPaths
 * @module tools/helpers/tsconfigPaths
 */

/**
 * Installs a custom module load function that can adhere to paths in tsconfig.
 *
 * @param {ExplicitParams} [explicitParams] - Tsconfig path mapping options
 * @return {() => void} Function to undo paths registration
 */
function register(explicitParams) {
  // Resolve cjs directory index files
  require.extensions['.cjs'] = require.extensions['.js']

  // Get original node module and resolveFilename function
  const Module = require('module')
  const resolveFilename = Module._resolveFilename

  /**
   * Patches node's module loading.
   *
   * @param {string} specifier - Module specifier
   * @param {NodeJS.Module | null} parent - Module that imported `specifier`
   * @return {string} Resolved file URL
   */
  Module._resolveFilename = function (specifier, parent) {
    const CORE_MODULE = !!register.coreModules(Module.builtinModules)[specifier]
    let args = arguments

    if (!CORE_MODULE) {
      try {
        // Get match context
        const ctx = { parentURL: parent ? parent.id : undefined }

        // Attempt to resolve specifier using path mappings
        const match = matchSpecifier(specifier, ctx, explicitParams)

        // Update specifier if match was found
        if (match !== specifier) {
          args = [match, ...Array.prototype.slice.call(args, 1)]
        }
      } catch (error) {
        console.error(`${error.message}. tsconfig-paths skipped`)
        return () => void 0
      }
    }

    return resolveFilename.apply(this, args)
  }

  // Restore node's module loading to original state
  return () => {
    Module._resolveFilename = resolveFilename
  }
}

/**
 * Returns a map containing defined core modules.
 *
 * @param {string[]} [builtins] - Names of builtin core modules
 * @return {Record<string, boolean>} Core module map
 */
register.coreModules = builtins => {
  builtins = builtins || [
    'assert',
    'buffer',
    'child_process',
    'cluster',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'punycode',
    'querystring',
    'readline',
    'stream',
    'string_decoder',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib'
  ]

  const core = {}

  for (let module of builtins) core[module] = true
  return core
}

const baseUrl = process.cwd()

register({
  addMatchAll: true,
  baseUrl,
  mainFields: ['main'],
  paths: tsconfig(baseUrl, 'tsconfig.json').config.compilerOptions.paths
})
