import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { PasswordService } from '../password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  // 1) Find the user by email
  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  // 2) create user
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    return await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  // 3) fetch the user by id
  public async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
}
