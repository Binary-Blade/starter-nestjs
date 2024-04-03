import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

/**
 * Provides security utilities for password hashing and verification.
 */
@Injectable()
export class EncryptionService {
  /**
   * Hashes a plaintext password using the Argon2 algorithm.
   *
   * @param password The plaintext password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verifies a plaintext password against a given hash.
   *
   * @param hash The hash to verify against.
   * @param password The plaintext password to verify.
   * @returns A promise that resolves to a boolean indicating if the password matches the hash.
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
