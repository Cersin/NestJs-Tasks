import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypedConfigService } from '../../config/typed-config.service';
import { AuthConfig } from '../../config/auth.config';
import { PasswordService } from './password/password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: TypedConfigService) => ({
        secret: config.get<AuthConfig>('auth')?.jwt.secret,
        signOptions: {
          expiresIn: config.get<AuthConfig>('auth')?.jwt.expiresIn,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [PasswordService],
})
export class UsersModule {}
