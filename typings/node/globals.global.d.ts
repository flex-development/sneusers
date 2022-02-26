declare global {
  namespace NodeJS {
    interface TestingGlobal extends NodeJS.Global {
      chai: typeof chai
      expect: typeof expect
      inspect: typeof import('util')['inspect']
      pf: typeof pf
      sandbox: typeof sandbox
    }
  }

  type Package = typeof import('../../package.json')
}

export {}
