import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { InvalidCredentialsException } from '@common/exceptions/invalid-credentials.exception';
import { CreateUserDto } from '@modules/users/dto';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { TokenService } from '@security/token/token.service';
import { EncryptionService } from '@security/encryption/encryption.service';

/**
 * Service providing authentication functionality.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>, // Repository for accessing User entity operations.
    private encryptionService: EncryptionService, // Service for hashing and verifying passwords.
    private tokenService: TokenService // Service for managing JWT tokens, including creation and validation.
  ) {}

  /**
   * Signs up a new user with the provided details, hashes their password, and stores them in the database.
   * @param createUserDto The DTO containing new user information, including email and password.
   * @param role Optional: The role of the user, defaults to UserRole.USER if not specified.
   * @returns The saved User entity.
   * @throws UnauthorizedException If a user with the provided email already exists.
   */
  async signup(createUserDto: CreateUserDto, role: UserRole = UserRole.USER): Promise<User> {
    // Check for existing user with the same email
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    const hashedPassword = await this.encryptionService.hashPassword(createUserDto.password);
    // Create a new user with the hashed password and the role
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
      createdAt: new Date()
    });
    // Save the new user to the database
    return this.usersRepository.save(newUser);
  }

  /**
   * Authenticates a user with their email and password. If successful, generates JWT tokens for the session.
   * @param email User's email address.
   * @param password User's plain text password.
   * @returns JWT access and refresh tokens for the authenticated session.
   * @throws InvalidCredentialsException If the email doesn't exist or the password doesn't match.
   */
  async login(email: string, password: string): Promise<JWTTokens> {
    // Find the user by email
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    // Verify the provided password against the hashed password
    const validPassword = await this.encryptionService.verifyPassword(user.password, password);
    if (!validPassword) {
      throw new InvalidCredentialsException();
    }
    user.lastLogin = new Date(); // Updates the last login timestamp.
    await this.usersRepository.save(user);

    return this.tokenService.getTokens(user); // Generates and returns JWT tokens for the user.
  }

  /**
   * Updates a user's password by verifying their old password and hashing the new password.
   * @param userId The ID of the user to update.
   * @param oldPassword The user's current password.
   * @param newPassword The user's new password.
   * @returns A promise that resolves when the password is successfully updated.
   * @throws NotFoundException If the user ID does not exist in the database.
   * @throws InvalidCredentialsException If the old password does not match the user's current password.
   */
  async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException();
    }
    const validPassword = await this.encryptionService.verifyPassword(user.password, oldPassword);
    if (!validPassword) {
      throw new InvalidCredentialsException();
    }

    const hashedPassword = await this.encryptionService.hashPassword(newPassword);
    // Directly assign the new hashed password to the user entity
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  /**
   * Logs out a user by invalidating their current refresh token and incrementing their token version.
   * @param userId The ID of the user to logout.
   * @throws NotFoundException If the user ID does not exist in the database.
   */
  async logout(userId: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('User not connected');
    }
    await this.tokenService.removeRefreshToken(userId); // Invalidate the current refresh token.
    user.tokenVersion += 1; // Incrementing the token version invalidates all previously issued tokens.
    await this.usersRepository.save(user);
  }
}
