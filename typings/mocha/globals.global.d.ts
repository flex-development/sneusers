declare global {
  namespace Mocha {
    interface Context {
      faker: typeof import('@faker-js/faker')['faker']
      inspect: NodeJS.TestingGlobal['inspect']
      pf: NodeJS.TestingGlobal['pf']
      sandbox: NodeJS.TestingGlobal['sandbox']
    }

    interface RunnerOptions {
      reporterOptions?: any
    }
  }
}

export {}
