/**
 * @file Reporters - Notifier
 * @module tests/reporters/Notifier
 */

import type { OneOrMany } from '@flex-development/tutils'
import ci from 'is-ci'
import notifier from 'node-notifier'
import type NotificationCenter from 'node-notifier/notifiers/notificationcenter'
import { performance } from 'node:perf_hooks'
import { promisify } from 'node:util'
import { dedent } from 'ts-dedent'
import type { File, Reporter, Task, Test, Vitest } from 'vitest'

/**
 * Custom reporter that sends a notification when all tests have been ran.
 *
 * @see https://vitest.dev/config/#reporters
 *
 * @implements {Reporter}
 */
class Notifier implements Reporter {
  /**
   * Test reporter context.
   *
   * @public
   * @instance
   * @member {Vitest} ctx
   */
  public ctx: Vitest = {} as Vitest

  /**
   * Test run end time (in milliseconds).
   *
   * @public
   * @instance
   * @member {number} end
   */
  public end: number = 0

  /**
   * Test run start time (in milliseconds).
   *
   * @public
   * @instance
   * @member {number} start
   */
  public start: number = 0

  /**
   * Sends a notification.
   *
   * **Note**: Does nothing in CI environments.
   *
   * @protected
   * @async
   *
   * @param {File[]} [files=this.ctx.state.getFiles()] - File objects
   * @param {unknown[]} [errors=this.ctx.state.getUnhandledErrors()] - Errors
   * @return {Promise<void>} Nothing when complete
   */
  protected async notify(
    files: File[] = this.ctx.state.getFiles(),
    errors: unknown[] = this.ctx.state.getUnhandledErrors()
  ): Promise<void> {
    // do nothing in ci environments
    if (ci) return void ci

    /**
     * Test objects.
     *
     * @const {Test[]} tests
     */
    const tests: Test[] = this.tests(files)

    /**
     * Total number of failed tests.
     *
     * @const {number} fails
     */
    const fails: number = tests.filter(t => t.result?.state === 'fail').length

    /**
     * Total number of passed tests.
     *
     * @const {number} passes
     */
    const passes: number = tests.filter(t => t.result?.state === 'pass').length

    /**
     * Notification message.
     *
     * @var {string} message
     */
    let message: string = ''

    /**
     * Notification title.
     *
     * @var {string} title
     */
    let title: string = ''

    // get notification title and message based on number of failed tests
    if (fails || errors.length > 0) {
      message = dedent`
        ${fails} of ${tests.length} tests failed
        ${errors.length} unhandled errors
      `

      title = '\u274C Failed'
    } else {
      /**
       * Total time to run all tests (in milliseconds).
       *
       * @const {number} time
       */
      const time: number = this.end - this.start

      message = dedent`
        ${passes} tests passed in ${
        time > 1000 ? `${(time / 1000).toFixed(2)}ms` : `${Math.round(time)}ms`
      }
      `

      title = '\u2705 Passed'
    }

    // send notification
    return void (await promisify<NotificationCenter.Notification>(
      notifier.notify.bind(notifier)
    )({
      message,
      sound: true,
      timeout: 10,
      title
    }))
  }

  /**
   * Sends a notification after all tests have ran.
   *
   * @public
   * @async
   *
   * @param {File[]} [files=this.ctx.state.getFiles()] - File objects
   * @param {unknown[]} [errors=this.ctx.state.getUnhandledErrors()] - Errors
   * @return {Promise<void>} Nothing when complete
   */
  public async onFinished(
    files: File[] = this.ctx.state.getFiles(),
    errors: unknown[] = this.ctx.state.getUnhandledErrors()
  ): Promise<void> {
    this.end = performance.now()
    return void (await this.notify(files, errors))
  }

  /**
   * Initializes the reporter.
   *
   * @public
   *
   * @param {Vitest} context - Test reporter context
   * @return {void} Nothing when complete
   */
  public onInit(context: Vitest): void {
    this.ctx = context
    return void (this.start = performance.now())
  }

  /**
   * Returns an array of {@linkcode Test} objects.
   *
   * @protected
   *
   * @param {OneOrMany<Task>} [tasks=[]] - Tasks to collect tests from
   * @return {Test[]} `Test` object array
   */
  protected tests(tasks: OneOrMany<Task> = []): Test[] {
    const { mode } = this.ctx

    return (Array.isArray(tasks) ? tasks : [tasks]).flatMap(task => {
      const { type } = task

      return mode === 'typecheck' && type === 'suite' && task.tasks.length === 0
        ? ([task] as unknown as [Test])
        : type === 'test'
        ? [task]
        : 'tasks' in task
        ? task.tasks.flatMap(t => (t.type === 'test' ? [t] : this.tests(t)))
        : []
    })
  }
}

export default Notifier
