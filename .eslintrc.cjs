/**
 * @file ESLint Configuration - Root
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

/**
 * @type {import('eslint').Linter.Config}
 * @const config - ESLint configuration object
 */
const config = {
  extends: ['./.eslintrc.base.cjs'],
  overrides: [
    ...require('./.eslintrc.base.cjs').overrides,
    {
      files: [
        'src/subdomains/docs/controllers/__tests__/docs.controller.e2e.spec.ts'
      ],
      rules: {
        'sort-keys': 0
      }
    }
  ],
  root: true
}

module.exports = config
