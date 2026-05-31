import { Controller, HttpCode, HttpStatus, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: { email: string }) {
    return this.authService.signIn(signInDto.email);
  }
}
