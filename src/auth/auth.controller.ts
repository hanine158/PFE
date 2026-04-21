import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() data: { email: string; password: string }) {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException('Email et mot de passe requis');
    }
    // La méthode login de AuthService retourne { user, tokens }
    const result = await this.authService.login({ email, password });
    // Pour rester compatible avec ton frontend qui attend { accessToken, user }
    return {
      accessToken: result.tokens.accessToken,
      user: result.user,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('Email requis');
    }
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { token: string; password: string }) {
    if (!data.password || data.password.trim() === '') {
      throw new BadRequestException('Mot de passe requis');
    }
    if (!data.token || data.token.trim() === '') {
      throw new BadRequestException('Token requis');
    }
    return this.authService.resetPassword(data.token, data.password);
  }
}