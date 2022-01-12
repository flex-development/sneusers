import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload, LoginDTO } from '@sneusers/subdomains/auth/dtos'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'

/**
 * @file Auth Subdomain Providers - AuthService
 * @module sneusers/subdomains/auth/providers/AuthService
 */

@Injectable()
class AuthService {
  constructor(
    private readonly jwt: JwtService,
    protected readonly users: UsersService
  ) {}

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
   * Logs in a user.
   *
   * @template T - User type
   *
   * @async
   * @param {T} user - User to login
   * @return {Promise<LoginDTO>} Promise containing access token
   */
  async login<T extends IUserRaw = User>(user: T): Promise<LoginDTO> {
    const payload: JwtPayload = {
      email: user.email,
      first_name: user.first_name,
      id: user.id,
      last_name: user.last_name
    }

    return { access_token: await this.jwt.signAsync(payload), ...payload }
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
