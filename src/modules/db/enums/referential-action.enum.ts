/**
 * @file DatabaseModule Enums - ReferentialAction
 * @module sneusers/modules/db/enums/ReferentialAction
 */

/**
 * What should happen when a referenced foreign key is deleted or updated.
 *
 * @see https://www.postgresqltutorial.com/postgresql-foreign-key
 *
 * @enum {Uppercase<string>}
 */
enum ReferentialAction {
  CASCADE = 'CASCADE',
  NONE = 'NO ACTION',
  RESTRICT = 'RESTRICT',
  SET_DEFAULT = 'SET DEFAULT',
  SET_NULL = 'SET NULL'
}

export default ReferentialAction
