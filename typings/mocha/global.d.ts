declare global {
  namespace Mocha {
    interface Context {
      faker: NodeJS.TestingGlobal['faker']
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
