import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'

/**
 * @file Auth Subdomain Providers - AuthService
 * @module sneusers/subdomains/auth/providers/AuthService
 */

@Injectable()
class AuthService {
  constructor(protected readonly users: UsersService) {}

  /**
   * Verifies a user's email and password.
   *
   * @async
   * @param {string} email - User email
   * @param {NullishString} password - User password
   * @return {Promise<User>} Promise containing authenticated user
   */
  async authenticate(
    email: User['email'],
    password: User['password']
  ): Promise<User> {
    return await this.users.repo.authenticate(email, password)
  }

  /**
   * Creates and authenticates a new user.
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @return {Promise<User>} - Promise containing new user
   */
  async register(dto: CreateUserDTO): Promise<User> {
    await this.users.create(dto)
    return await this.authenticate(dto.email, dto.password || null)
  }
}

export default AuthService
