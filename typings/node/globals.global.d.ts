declare global {
  namespace NodeJS {
    interface TestingGlobal extends NodeJS.Global {
      assert: typeof assert
      chai: typeof chai
      faker: typeof faker
      pf: typeof pf
      sandbox: typeof sandbox
    }
  }

  const PKG: string
  type Package = typeof import('../../package.json')
}

export {}
