import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('createUserDto', () => {
  let dto = new CreateUserDto();

  const testPassword = async (password: string) => {
    // Arrange
    dto.password = password;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.isStrongPassword).toContain(
      'password is not strong enough',
    );
  };

  beforeEach(() => {
    dto = new CreateUserDto();

    dto.email = 'test@test.com';
    dto.name = 'Name';
    dto.password = 'Test12345.';
  });

  it('should validate complete valid data', async () => {
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(0);
  });

  it('should throw error with wrong email', async () => {
    // Arrange
    dto.email = 'test';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });

  it('should throw error with empty name', async () => {
    // Arrange
    dto.name = '';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('name');
  });

  // PASSWORD VALIDATION
  // 1) at least 1 uppercase letter
  // 2) at least 1 lowercase letter
  // 3) at least 1 number
  // 4) at least 1 symbol
  // 5) minimum 8 chars
  it('should throw error without uppercase letter', async () => {
    await testPassword('test12345.');
  });
  it('should throw error without lowercase letter', async () => {
    await testPassword('TEST12345..');
  });
  it('should throw error without number', async () => {
    await testPassword('TESTabcdef..');
  });
  it('should throw error without symbol', async () => {
    await testPassword('TESTabcdef123');
  });
  it('should throw error without minimal chars', async () => {
    await testPassword('Te1.');
  });
});
