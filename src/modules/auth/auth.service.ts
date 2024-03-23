import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { InvalidCredentialsException } from '@common/exceptions/invalid-credentials.exception';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { CreateUserDto } from '@modules/users/dto';
import { SecurityService, TokenService } from '@config/securities';

/**
 * Service providing authentication functionality.
 */
@Injectable()
export class AuthService {
  /**
   * AuthService constructor.
   * @param usersRepository The TypeORM repository for User entities.
   * @param securityService The service handling security concerns such as hashing.
   * @param tokenService The service responsible for managing JWT tokens.
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private securityService: SecurityService,
    private tokenService: TokenService,
  ) { }

  /**
   * Handles user signup logic.
   * @param createUserDto Data transfer object containing the user details.
   * @param role The role assigned to the user, defaulting to UserRole.USER.
   * @returns A promise that resolves to the newly created User entity.
   * @throws UnauthorizedException if the email already exists.
   */
  async signup(createUserDto: CreateUserDto, role: UserRole = UserRole.USER): Promise<User> {
    // Check for existing user with the same email
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    // Hash the user's password
    const hashedPassword = await this.securityService.hashPassword(createUserDto.password);
    // Create a new user with the hashed password and the role
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });
    // Save the new user to the database
    return this.usersRepository.save(newUser);
  }

  /**
   * Handles user login logic.
   * @param email The email of the user trying to log in.
   * @param password The plaintext password provided by the user for login.
   * @returns A promise that resolves to an object containing JWT tokens.
   * @throws InvalidCredentialsException if the login credentials are invalid.
   */
  async login(email: string, password: string): Promise<JWTTokens> {
    // Find the user by email
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    // Verify the provided password against the hashed password
    const validPassword = await this.securityService.verifyPassword(user.password, password);
    if (!validPassword) {
      throw new InvalidCredentialsException();
    }
    // Return the JWT tokens for the user
    return this.tokenService.getTokens(user);
  }
}

