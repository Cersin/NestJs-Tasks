import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // hash()
  // plain text => hash
  // for the same input => same output
  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    const password = 'Test12345.';
    const result = await service.hash(password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should validate hashed password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.verify('password123', 'hashed_password');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashed_password',
    );
    expect(result).toBe(true);
  });

  it('should fail on validating with incorrect password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.verify('password123', 'hashed_password');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashed_password',
    );
    expect(result).toBe(false);
  });
});
