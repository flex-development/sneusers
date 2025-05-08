declare namespace NodeJS {
  /**
   * User environment.
   *
   * @extends {Dict<string>}
   */
  interface ProcessEnv extends Dict<string> {
    /**
     * The type of environment the Node.js process is running in.
     */
    NODE_ENV?: 'development' | 'production' | 'test' | undefined
  }
}
