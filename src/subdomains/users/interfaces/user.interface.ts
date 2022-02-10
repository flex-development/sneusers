import IUserRaw from './user-raw.interface'

/**
 * @file Users Subdomain Interfaces - IUser
 * @module sneusers/subdomains/users/interfaces/IUser
 */

/**
 * Object representing a `User` entity (see {@link IUserRaw}), and all of its
 * [virtual fields][1].
 *
 * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 *
 * @extends IUserRaw
 */
interface IUser extends IUserRaw {
  name: string
}

export default IUser
