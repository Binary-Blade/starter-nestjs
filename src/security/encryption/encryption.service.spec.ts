import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { EncryptionService } from './encryption.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn()
}));

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService]
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const mockPassword = 'password';
      const mockHashedPassword = 'hashedPassword';
      (argon2.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const hashedPassword = await service.hashPassword(mockPassword);

      expect(hashedPassword).toBe(mockHashedPassword);
      expect(argon2.hash).toHaveBeenCalledWith(mockPassword);
    });
  });

  describe('verifyPassword', () => {
    it('should return true if the password matches the hash', async () => {
      const mockHash = 'mockHash';
      const mockPassword = 'password';
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword(mockHash, mockPassword);

      expect(result).toBeTruthy();
      expect(argon2.verify).toHaveBeenCalledWith(mockHash, mockPassword);
    });

    it('should return false if the password does not match the hash', async () => {
      const mockHash = 'mockHash';
      const mockPassword = 'wrongPassword';
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyPassword(mockHash, mockPassword);

      expect(result).toBeFalsy();
      expect(argon2.verify).toHaveBeenCalledWith(mockHash, mockPassword);
    });
  });
});
