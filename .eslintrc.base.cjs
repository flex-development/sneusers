/**
 * @file ESLint Configuration - Base
 * @see https://eslint.org/docs/user-guide/configuring
 * @see https://github.com/prettier/eslint-config-prettier
 */

module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {},
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    babelOptions: {},
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    },
    extraFileExtensions: ['.cjs', '.mjs'],
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: true
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'jsdoc',
    'markdown',
    'spellcheck',
    'tree-shaking',
    'unicorn'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      2,
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description'
      }
    ],
    '@typescript-eslint/ban-types': 1,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        multiline: {
          delimiter: 'none',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-useless-constructor': 1,
    '@typescript-eslint/no-var-requires': 1,
    eqeqeq: 1,
    'import/no-anonymous-default-export': 0,
    'jsdoc/check-indentation': [0, { excludeTags: ['description', 'example'] }],
    'jsdoc/check-line-alignment': 1,
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': [1, { definedTags: ['link'] }],
    'jsdoc/no-multi-asterisks': 0,
    'jsdoc/no-undefined-types': [
      1,
      {
        definedTypes: [
          'EsmLoader',
          'Exception',
          'ExceptionJSON',
          'Mocha',
          'NodeJS',
          'NodeModule',
          'never',
          'unknown'
        ]
      }
    ],
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-throws': 1,
    'jsdoc/tag-lines': [
      1,
      'any',
      {
        count: 1,
        noEndLines: false,
        tags: {}
      }
    ],
    'no-ex-assign': 0,
    'prefer-arrow-callback': 2,
    'prettier/prettier': [2, require('./.prettierrc.cjs')],
    'sort-keys': [
      1,
      'asc',
      {
        caseSensitive: true,
        minKeys: 2,
        natural: true
      }
    ],
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    'spellcheck/spell-checker': [
      2,
      {
        comments: true,
        identifiers: false,
        lang: 'en_US',
        minLength: 3,
        skipIfMatch: [/\$.*/],
        skipWordIfMatch: [],
        skipWords: [
          'argv',
          'bdd',
          'builtins',
          'chai',
          'commonjs',
          'cjs',
          'commitlint',
          'ctx',
          'dedupe',
          'dgram',
          'dns',
          'dotenv',
          'enum',
          'esm',
          'extensionless',
          'formatter',
          'globals',
          'jsonspec',
          'mocharc',
          'msg',
          'namespace',
          'perf',
          'pnv',
          'prog',
          'punycode',
          'querystring',
          'readline',
          'redeclare',
          'sinon',
          'testcase',
          'tgz',
          'tls',
          'tsc',
          'tsconfig',
          'tty',
          'typeof',
          'usr',
          'vscode',
          'wasm',
          'wip',
          'yargs',
          'zlib'
        ],
        strings: true
      }
    ],
    'unicorn/consistent-function-scoping': 2,
    'unicorn/custom-error-definition': 2,
    'unicorn/filename-case': [
      2,
      {
        cases: { kebabCase: true },
        ignore: [/^.md?x/i]
      }
    ],
    'unicorn/import-index': 2,
    'unicorn/import-style': [
      2,
      {
        styles: {
          shelljs: { default: true }
        }
      }
    ],
    'unicorn/explicit-length-check': 2,
    'unicorn/new-for-builtins': 2,
    'unicorn/no-abusive-eslint-disable': 2,
    'unicorn/no-array-callback-reference': 2,
    'unicorn/no-array-for-each': 2,
    'unicorn/no-array-method-this-argument': 2,
    'unicorn/no-array-push-push': 2,
    'unicorn/no-array-reduce': 2,
    'unicorn/no-for-loop': 2,
    'unicorn/no-instanceof-array': 2,
    'unicorn/no-lonely-if': 2,
    'unicorn/no-new-array': 2,
    'unicorn/no-new-buffer': 2,
    'unicorn/no-object-as-default-parameter': 2,
    'unicorn/no-this-assignment': 2,
    'unicorn/no-unsafe-regex': 2,
    'unicorn/no-unused-properties': 2,
    'unicorn/no-useless-fallback-in-spread': 2,
    'unicorn/no-useless-length-check': 2,
    'unicorn/no-useless-spread': 2,
    'unicorn/no-useless-undefined': 2,
    'unicorn/no-zero-fractions': 2,
    'unicorn/number-literal-case': 0,
    'unicorn/numeric-separators-style': 2,
    'unicorn/prefer-array-find': 2,
    'unicorn/prefer-array-flat-map': 2,
    'unicorn/prefer-array-index-of': 2,
    'unicorn/prefer-array-some': 2,
    'unicorn/prefer-default-parameters': 2,
    'unicorn/prefer-includes': 2,
    'unicorn/prefer-module': 2,
    'unicorn/prefer-number-properties': 2,
    'unicorn/prefer-object-from-entries': [
      2,
      {
        functions: ['fromPairs']
      }
    ],
    'unicorn/prefer-object-has-own': 2,
    'unicorn/prefer-optional-catch-binding': 2,
    'unicorn/prefer-prototype-methods': 2,
    'unicorn/prefer-regexp-test': 2,
    'unicorn/prefer-set-has': 2,
    'unicorn/prefer-spread': 2,
    'unicorn/prefer-string-replace-all': 2,
    'unicorn/prefer-string-slice': 2,
    'unicorn/prefer-string-starts-ends-with': 2,
    'unicorn/prefer-string-trim-start-end': 2,
    'unicorn/prefer-switch': 2,
    'unicorn/prefer-ternary': 2,
    'unicorn/prefer-type-error': 2,
    'unicorn/throw-new-error': 2
  },
  overrides: [
    {
      files: ['**/*.cjs', '**/*.cts', '**/*.js'],
      rules: {
        'unicorn/prefer-module': 0
      }
    },
    {
      files: ['**/*.cjs', '**/*.cts', '**/*.md/*.js', '**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0
      }
    },
    {
      files: ['**/*.d.cts'],
      rules: {
        'prettier/prettier': 0
      }
    },
    {
      files: ['**/*.interface.ts', '**/*.types.ts'],
      rules: {
        'jsdoc/check-indentation': 0
      }
    },
    {
      files: ['**/*.md'],
      extends: ['plugin:markdownlint/recommended'],
      parser: require.resolve('eslint-plugin-markdownlint/parser'),
      processor: 'markdown/markdown'
    },
    {
      files: ['**/*.md/*.ts'],
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      files: ['**/*.spec.ts'],
      env: {
        mocha: true
      },
      globals: {
        after: true,
        afterEach: true,
        assert: true,
        before: true,
        beforeEach: true,
        chai: true,
        describe: true,
        it: true,
        pf: true,
        sandbox: true
      },
      plugins: ['chai-expect', 'mocha'],
      rules: {
        'chai-expect/missing-assertion': 2,
        'chai-expect/no-inner-compare': 2,
        'chai-expect/no-inner-literal': 2,
        'chai-expect/terminating-properties': [2, { properties: [] }],
        'mocha/handle-done-callback': [0, { ignoreSkipped: false }],
        'mocha/max-top-level-suites': [2, { limit: 1 }],
        'mocha/no-async-describe': 2,
        'mocha/no-exclusive-tests': 2,
        'mocha/no-exports': 2,
        'mocha/no-global-tests': 2,
        'mocha/no-hooks': 0,
        'mocha/no-hooks-for-single-case': 0,
        'mocha/no-identical-title': 2,
        'mocha/no-mocha-arrows': 0,
        'mocha/no-nested-tests': 2,
        'mocha/no-pending-tests': 2,
        'mocha/no-return-and-callback': 2,
        'mocha/no-return-from-async': 2,
        'mocha/no-setup-in-describe': 0,
        'mocha/no-sibling-hooks': 2,
        'mocha/no-skipped-tests': 0,
        'mocha/no-synchronous-tests': [0, { allowed: ['async'] }],
        'mocha/no-top-level-hooks': 2,
        'mocha/prefer-arrow-callback': 2,
        'mocha/valid-suite-description': [
          2,
          { pattern: '^[.$#@a-z0-9(DELETE|GET|PATCH|POST|PUT)]*.+' }
        ],
        'mocha/valid-test-description': [2, { pattern: '^should.[a-z0-9]+.*' }],
        'prefer-arrow-callback': 0,
        'tree-shaking/no-side-effects-in-initialization': 0,
        'unicorn/consistent-function-scoping': 0,
        'unicorn/explicit-length-check': 0,
        'unicorn/no-array-for-each': 0,
        'unicorn/no-useless-undefined': 0
      }
    },
    {
      files: ['**/.eslintrc.*', '**/.prettierrc.cjs'],
      rules: {
        'sort-keys': 0
      }
    },
    {
      files: ['**/.eslintrc.*', '**/.mocharc.*'],
      rules: {
        'spellcheck/spell-checker': 0
      }
    },
    {
      files: ['**/__doubles__/**', '**/__tests__/**', '**/tools/**'],
      rules: {
        'tree-shaking/no-side-effects-in-initialization': 0
      }
    },
    {
      files: ['**/typings/**'],
      rules: {
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/triple-slash-reference': 0,
        'unicorn/filename-case': 0
      }
    },
    {
      files: ['__tests__/reporters/jsonspec.ts'],
      rules: {
        'sort-keys': 0
      }
    },
    {
      files: ['typings/node/globals.global.d.ts'],
      rules: {
        'no-var': 0
      }
    }
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.cjs',
        '.cts',
        '.d.cts',
        '.d.mts',
        '.d.ts',
        '.mts',
        '.ts'
      ]
    },
    'import/resolver': {
      node: {
        extensions: ['.cjs', '.cts', '.mts', '.ts'],
        moduleDirectory: ['node_modules', 'src']
      },
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json']
      }
    },
    jsdoc: {
      augmentsExtendsReplacesDocs: true,
      implementsReplacesDocs: true,
      mode: 'typescript',
      overrideReplacesDocs: true,
      structuredTags: {
        param: {
          required: ['name', 'type']
        },
        throws: {
          name: 'namepath-defining',
          required: ['type']
        }
      },
      tagNamePreference: {
        augments: 'extends',
        constant: 'const',
        returns: 'return'
      }
    }
  }
}
