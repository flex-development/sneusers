interface String {
  /**
   * Converts all the alphabetic characters in a string to lowercase.
   *
   * @return {string} Lowercase string
   */
  toLowerCase(): Lowercase<string>

  /**
   * Converts all alphabetic characters to lowercase, taking into account the
   * host environment's current locale.
   *
   * @param {string | string[]} [locales] - Locales to consider
   * @return {string} Lowercase string
   */
  toLocaleLowerCase(): Lowercase<string>
}
