import { isNIL } from '@flex-development/tutils/guards'
import { AbstractDataTypeConstructor, DataTypes, Sequelize } from 'sequelize'
import { AnyFunction } from 'sequelize/types/lib/utils'

/**
 * @file DatabaseModule Hooks - beforeConnect
 * @module sneusers/modules/db/hooks/beforeConnect
 */

/**
 * Fires before `Sequelize` obtains a connection to the database. This function:
 *
 * - Refreshes type parsers for boolean and numeric fields. Sequelize converts
 *   some numeric fields into strings to prevent overflow errors, but our fields
 *   remain small enough that it's (probably) safe to override those parsers.
 *
 *   @see https://github.com/sequelize/sequelize/issues/9074#issuecomment-524914844
 *
 * @param {Sequelize} this - `Sequelize` instance
 * @return {void} Nothing when complete
 */
function beforeConnect(this: Sequelize): void {
  /**
   * Clones a data type.
   *
   * @param {AbstractDataTypeConstructor} type - Data type to clone
   * @param {AnyFunction} [parse] - Parse function override
   * @return {AbstractDataTypeConstructor} Cloned data type
   */
  const cloneDataType = (
    type: AbstractDataTypeConstructor,
    parse?: AnyFunction
  ): AbstractDataTypeConstructor => {
    const clone = { key: type.key }

    for (const name of Object.getOwnPropertyNames(type)) {
      clone[name] = type[name]
    }

    if (parse) clone['parse'] = parse

    return clone as unknown as AbstractDataTypeConstructor
  }

  /**
   * Converts `value` into a `boolean`.
   *
   * @param {unknown} value - Value to convert
   * @return {boolean} Parsed value
   */
  const parseBoolean = (value: unknown): boolean => {
    let sanitized = DataTypes.BOOLEAN.prototype._sanitize(value)

    if (sanitized === 'f') sanitized = false
    if (sanitized === 't') sanitized = true

    if (typeof sanitized !== 'boolean') {
      sanitized = isNIL(sanitized) ? false : true
    }

    return sanitized
  }

  return this.connectionManager.refreshTypeParser({
    ...DataTypes,
    BIGINT: cloneDataType(DataTypes.BIGINT, Number.parseInt),
    BOOLEAN: cloneDataType(DataTypes.BOOLEAN, parseBoolean),
    DECIMAL: cloneDataType(DataTypes.DECIMAL, Number.parseFloat),
    INTEGER: cloneDataType(DataTypes.INTEGER, Number.parseInt),
    NUMERIC: cloneDataType(DataTypes.DECIMAL, Number.parseFloat)
  })
}

export default beforeConnect
