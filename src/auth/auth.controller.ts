import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('Email is required');
    }
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { token: string; password: string }) {
    if (!data.password || data.password.trim() === '') {
      throw new BadRequestException('Password is required');
    }
    if (!data.token || data.token.trim() === '') {
      throw new BadRequestException('Token is required');
    }
    return this.authService.resetPassword(data.token, data.password);
  }
}