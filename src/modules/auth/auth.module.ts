import { AuthService } from './services/auth.service';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { AuthImplService } from './services/auth-impl.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user/user.entity';
import {RolePermission} from "../../database/entities";
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User, RolePermission]),
  ],
  providers: [
    {
      provide: AuthService,
      useClass: AuthImplService,
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
