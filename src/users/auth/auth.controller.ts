import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../create-user.dto';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import { User } from '../users.entity';
import { AuthRequest } from '../auth.request';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.register(createUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(loginDto);
    return new LoginResponse({ accessToken });
  }

  @Get('profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.usersService.findOne(request.user.sub);
    if (user) {
      return user;
    }

    throw new NotFoundException();
  }
}
