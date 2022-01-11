declare global {
  namespace NodeJS {
    interface TestingGlobal extends NodeJS.Global {
      chai: typeof chai
      expect: typeof expect
      faker: typeof faker
      inspect: typeof import('util')['inspect']
      pf: typeof pf
      sandbox: typeof sandbox
    }
  }

  type Package = typeof import('../../package.json')
}

export {}
