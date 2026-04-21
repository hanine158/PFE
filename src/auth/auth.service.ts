import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  // ========================= LOGIN =========================
  async login(data: AuthDto) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userService.findByEmail(data.email);

    const passwordValid = await argon2.verify(user.password, data.password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
      tokens,
    };
  }

  // ========================= LOGOUT =========================
  async logout(userId: number) {
    await this.userService.update(userId, { refreshToken: null });
  }

  // ========================= TOKENS =========================
  async getTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // ========================= HASH REFRESH TOKEN =========================
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashed = await argon2.hash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashed,
    });
  }

  // ========================= REFRESH TOKENS =========================
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshValid = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshValid) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ========================= FORGOT PASSWORD =========================
  async forgotPassword(email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '10m',
      },
    );

    await this.userService.updateToken(user.id, token);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset',
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password</p>
        <a href="http://localhost:3001/auth/reset/${token}">
          Reset Password
        </a>
      `,
    });

    return {
      success: true,
      message: 'Reset email sent',
    };
  }

  // ========================= RESET PASSWORD =========================
  async resetPassword(token: string, password: string) {
    if (!token || !password) {
      throw new BadRequestException('Token and password required');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      const user = await this.userService.findOne(decoded.id);

      user.password = await argon2.hash(password);
      user.refreshToken = null;

      await this.userService.saveUser(user);

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}