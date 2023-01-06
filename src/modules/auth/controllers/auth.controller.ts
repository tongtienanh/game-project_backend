import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ResponseEntity } from 'src/common/resources/base/response.entity';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from './../requests/login.request';

@Controller('api/auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('/login')
  async login(@Body() request: LoginRequest) {
    const data = await this.authService.login(request);

    return new ResponseEntity<string>(data);
  }
}
