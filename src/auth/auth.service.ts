import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';



@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private MailerService: MailerService,
    
    
  ) { }
  async signIn(data: AuthDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User not found');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) throw new BadRequestException('password is incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }
  async logout(userId: number) {
    await this.userService.update(userId, { refreshToken: null });
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, { refreshToken: hashedRefreshToken });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user= await this.userService.findOne(userId);
    if (!user|| !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  async forgotPassword(email: string) {
    try {
      const existing = await this.userService.findByEmail(email);
      if (!existing) {
        throw new NotFoundException('user not found');
      } else {
        const token = await this.jwtService.sign(
          {
            id: existing.id,
          },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '10m',
          },
        );
        await this.userService.updateToken(existing.id, token);
        const options = {
          to: existing.email,
          subject: 'forget password',
         html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    
    <h2 style="color: #2c3e50;">Password Reset Request</h2>
    
    <p>Hello ${existing.email},</p>
    
    <p>
      We received a request to reset your password. 
      If you made this request, please click the button below to set a new password.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:3001/auth/reset/${token}" 
         style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
         Reset My Password
      </a>
    </div>

    <p>
      This link will expire in <strong>10 minutes</strong> for security reasons.
    </p>

    <p>
      If you did not request a password reset, please ignore this email.
      Your password will remain unchanged.
    </p>

    <hr style="margin: 30px 0;" />

    <p style="font-size: 12px; color: gray;">
      This is an automated message. Please do not reply to this email.
    </p>

  </div>
`,
        };
        await this.MailerService.sendMail(options);
        return {
          success: true,
          message: 'You can change password',
        };
      }
    } catch (error) {
      return 'erreur';
    }
  }
  
}