import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: CreateAuthDto) {
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException('Nom requis');
    }

    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('Email requis');
    }

    if (!data.password || data.password.trim() === '') {
      throw new BadRequestException('Mot de passe requis');
    }

    const result = await this.authService.signup({
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
    });

    return {
      message: result.message,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    };
  }

  @Post('signin')
  async signin(@Body() data: AuthDto) {
    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('Email requis');
    }

    if (!data.password || data.password.trim() === '') {
      throw new BadRequestException('Mot de passe requis');
    }

    const result = await this.authService.login({
      ...data,
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
    });

    return {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('Email requis');
    }

    return await this.authService.forgotPassword(
      data.email.trim().toLowerCase(),
    );
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { token: string; password: string }) {
    if (!data.token || data.token.trim() === '') {
      throw new BadRequestException('Token requis');
    }

    if (!data.password || data.password.trim() === '') {
      throw new BadRequestException('Mot de passe requis');
    }

    return await this.authService.resetPassword(
      data.token.trim(),
      data.password.trim(),
    );
  }
}