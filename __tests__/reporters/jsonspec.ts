import type { MochaAssertionResult, MochaReport } from '@tests/utils/types'
import fs from 'fs'
import Mocha from 'mocha'

/**
 * @file Test Reporters - JSON Spec
 * @module tests/reporters/jsonspec
 */

/**
 * Custom reporter options.
 */
type ReporterOptions = {
  /**
   * Output filename.
   *
   * @default '__tests__/report.json'
   */
  filename?: string
}

/**
 * Intergrated [Mocha Spec][1] and `JSON` file reporter.
 *
 * @see https://mochajs.org/api/tutorial-custom-reporter.html
 *
 * [1]: https://mochajs.org/#spec
 *
 * @extends {Mocha.reporters.Spec}
 */
class Reporter extends Mocha.reporters.Spec {
  /**
   * @static
   * @property {string} DEFAULT_REPORT_FILENAME - Default output filename
   */
  static DEFAULT_REPORT_FILENAME: string = '__tests__/report.json'

  /**
   * Creates a new Mocha reporter that writes test results to a `json` file.
   *
   * @param {Mocha.Runner} runner - Current runner
   * @param {Mocha.RunnerOptions} options - Runner options
   * @param {ReporterOptions} [options.reporterOptions] - Reporter options
   * @param {string} [options.reporterOptions.filename] - Output filename
   */
  constructor(runner: Mocha.Runner, options: Mocha.RunnerOptions) {
    super(runner, options)

    // Init suite and test objects array
    const suites: Record<Mocha.Suite['title'], Mocha.Suite> = {}
    const tests: Mocha.Test[] = []

    // Add suite object to suites array
    runner.on(Mocha.Runner.constants.EVENT_SUITE_END, suite => {
      if (!suite.root) suites[suite.title] = suite
    })

    // Add test object to tests array
    runner.on(Mocha.Runner.constants.EVENT_TEST_END, test => {
      if (test.file && test.title) tests.push(test)
    })

    // Create new report once all tests have been run
    runner.once(Mocha.Runner.constants.EVENT_RUN_END, () => {
      // Init test map
      const map: Record<string, Mocha.Test[]> = {}

      // Get unique test file names
      const files = [...new Set(tests.map(r => r.file as string)).values()]

      // Map tests to files
      for (const file of files) map[file] = tests.filter(s => s.file === file)

      // Build report object
      const report: MochaReport = {
        stats: this.stats,
        results: Object.entries(map).map(([file, tests]) => {
          const suite = suites[tests[0].titlePath()[0]]

          return {
            assertion_results: tests.map(test => ({
              body: test.body,
              // @ts-expect-error property 'currentRetry' is protected
              current_retry: test.currentRetry(),
              duration: test.duration,
              err: test.err || null,
              failure_messages: test.err ? [test.err.message] : [],
              file: test.file as string,
              full_title: test.fullTitle(),
              is_pending: test.isPending() || false,
              mocha_id: test['__mocha_id__'],
              parent: (() => {
                if (!test.parent) return

                return {
                  full_title: test.parent.fullTitle(),
                  mocha_id: test.parent['__mocha_id__']
                }
              })() as MochaAssertionResult['parent'],
              speed: test.speed,
              state: test.state,
              status: test.isPending() ? 'pending' : test.state || 'pending',
              title: test.title,
              title_path: test.titlePath()
            })),
            file,
            is_pending: suite.isPending(),
            mocha_id: suite['__mocha_id__'],
            title: suite.title
          }
        }),
        suites: Object.values(suites).map(suite => ({
          mocha_id: suite['__mocha_id__'],
          parent: suite.parent && { mocha_id: suite.parent['__mocha_id__'] },
          root: suite.root || false,
          title: suite.title
        })) as unknown as MochaReport['suites']
      }

      // Create report
      fs.writeFileSync(
        options.reporterOptions?.filename ?? Reporter.DEFAULT_REPORT_FILENAME,
        JSON.stringify(report, null, 2)
      )
    })
  }
}

// @ts-expect-error export assignment cannot be used in a module with other...
export = Reporter
export type { ReporterOptions }
