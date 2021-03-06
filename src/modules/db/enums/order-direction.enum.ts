/**
 * @file DatabaseModule Enums - OrderDirection
 * @module sneusers/modules/db/enums/OrderDirection
 */

/**
 * Specifies the direction in which to order entities.
 *
 * @enum {Uppercase<string>}
 */
enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
  NULLS_FIRST = 'NULLS FIRST'
}

export default OrderDirection
