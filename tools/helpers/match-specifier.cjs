const { createMatchPath } = require('tsconfig-paths')
const {
  ExplicitParams,
  configLoader
} = require('tsconfig-paths/lib/config-loader')

/**
 * @file Helpers - matchSpecifier
 * @module tools/helpers/matchSpecifier
 */

/**
 * Attempts to match `specifier` to a path alias defined in a tsconfig file.
 *
 * @see https://github.com/TypeStrong/ts-node/discussions/1450
 * @see https://github.com/dividab/tsconfig-paths
 *
 * @param {string} specifier - Module specifier
 * @param {{ parentURL: string }} ctx - Function context
 * @param {string} [ctx.parentURL] - Parent module specifier
 * @param {ExplicitParams} [explicitParams] - Tsconfig path mapping options
 * @return {string} Resolved file URL
 * @throws {Error}
 */
const matchSpecifier = (specifier, ctx, explicitParams) => {
  // Load TypeScript config to get path mappings
  const result = configLoader({ cwd: process.cwd(), explicitParams })

  // Handle possible error
  if (result.resultType === 'failed') throw new Error(result.message)

  // Get base URL and path aliases
  const { absoluteBaseUrl, addMatchAll, mainFields, paths } = result

  // Create path matching function
  const matchPath = createMatchPath(
    absoluteBaseUrl,
    paths,
    mainFields,
    addMatchAll
  )

  // Attempt to match specifier using path mappings
  const match = matchPath(specifier)

  // Return patch match if found. Otherwise return original specifier
  return match || specifier
}

module.exports = matchSpecifier
