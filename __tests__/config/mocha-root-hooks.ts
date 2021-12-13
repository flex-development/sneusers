import type { RootHookObject } from 'mocha'
import sinonChai from 'sinon-chai'

/**
 * @file Global Test Configuration - Root Hooks
 * @module tests/config/mochaHooks
 * @see https://mochajs.org/#defining-a-root-hook-plugin
 */

export const mochaHooks: RootHookObject = {
  /**
   * Handles the test environment state after all tests are run.
   *
   * @return {void} Nothing when complete
   */
  afterAll(): void {
    return
  },

  /**
   * Handles the test environment state after each test is run.
   *
   * This includes:
   *
   * - Resetting the history of all [stubs][1] created via the default sandbox
   * - Restoring all [fakes][2] created via the default sandbox
   *
   * [1]: https://sinonjs.org/releases/v11.1.2/stubs
   * [2]: https://sinonjs.org/releases/v11.1.2/fakes
   *
   *
   * @param {Mocha.Context} this - Current test context
   * @return {void} Nothing when complete
   */
  afterEach(this: Mocha.Context): void {
    this.sandbox.reset()
    this.sandbox.restore()
  },

  /**
   * Handles the test environment state before any tests are run.
   *
   * This includes:
   *
   * - Adding [`faker`][1] to {@link Mocha.Context}
   * - Adding [`pretty-format`][2] to {@link Mocha.Context}
   * - Adding [`sandbox`][3] to {@link Mocha.Context}
   * - Initializing [`sinon-chai`][4]
   *
   *
   * [1]: https://github.com/marak/Faker.js
   * [2]: https://github.com/facebook/jest/tree/main/packages/pretty-format
   * [3]: https://sinonjs.org/releases/v11.1.2/sandbox
   * [4]: https://github.com/domenic/sinon-chai#installation-and-usage
   *
   * @param {Mocha.Context} this - Current test context
   * @return {void} Nothing when complete
   */
  beforeAll(this: Mocha.Context): void {
    // Add faker, pretty-format, and global sandbox to test context
    this.faker = faker
    this.pf = pf
    this.sandbox = sandbox

    // Initialize plugins
    chai.use(sinonChai)
  },

  /**
   * Handles the test environment state before each test runs.
   *
   * @return {void} Nothing when complete
   */
  beforeEach(): void {
    return
  }
}
