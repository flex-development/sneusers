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
}

export {}
