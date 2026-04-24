import {
  BadRequestException,
  ConflictException,
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
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  // ========================= SIGNUP =========================
  async signup(data: CreateAuthDto) {
    const { name, email, password, role } = data;

    if (!name || !email || !password) {
      throw new BadRequestException('Champs obligatoires manquants');
    }

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }

    let userRole = UserRole.STUDENT;
    if (role === 'teacher') userRole = UserRole.TEACHER;
    if (role === 'admin') userRole = UserRole.ADMIN;

    const newUser = await this.userService.create({
      name,
      email,
      password,
      role: userRole,
    });

    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Bienvenue sur LearnX 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Bienvenue ${newUser.name}</h2>
          <p>Votre compte a été créé avec succès.</p>
          <p>Vous pouvez maintenant vous connecter à la plateforme.</p>
          <br />
          <p>Merci,<br />L'équipe LearnX</p>
        </div>
      `,
    });

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return {
      message: 'Inscription réussie',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        xp: newUser.xp,
        level: newUser.level,
      },
      tokens,
    };
  }

  // ========================= LOGIN =========================
  async login(data: AuthDto) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email et mot de passe requis');
    }

    const user = await this.userService.findUserByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Email ou mot de passe incorrect');
    }

    const valid = await argon2.verify(user.password, data.password);

    if (!valid) {
      throw new BadRequestException('Email ou mot de passe incorrect');
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

  // ========================= UPDATE REFRESH TOKEN =========================
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
      throw new ForbiddenException('Access denied');
    }

    const valid = await argon2.verify(user.refreshToken, refreshToken);

    if (!valid) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ========================= LOGOUT =========================
  async logout(userId: number) {
    await this.userService.update(userId, {
      refreshToken: null,
    });

    return {
      message: 'Déconnexion réussie',
    };
  }

  // ========================= FORGOT PASSWORD =========================
  async forgotPassword(email: string) {
    if (!email) {
      throw new BadRequestException('Email requis');
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '10m',
      },
    );

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Réinitialisation du mot de passe</h3>
          <p>Cliquez sur le bouton ci-dessous pour changer votre mot de passe :</p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Réinitialiser le mot de passe
          </a>

          <p style="margin-top: 20px;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
          </p>
          <p>${resetLink}</p>

          <p style="margin-top: 20px;">Ce lien expire dans 10 minutes.</p>
        </div>
      `,
    });

    return {
      message: 'Email de réinitialisation envoyé',
    };
  }

  // ========================= RESET PASSWORD =========================
async resetPassword(token: string, password: string) {
  if (!token || !password) {
    throw new BadRequestException('Token et mot de passe requis');
  }

  try {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    const user = await this.userService.findOne(decoded.id);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const hashedPassword = await argon2.hash(password);

    user.password = hashedPassword;
    user.refreshToken = null;

    await this.userService.saveUser(user);

    return {
      message: 'Mot de passe modifié avec succès',
    };
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    throw new UnauthorizedException('Token invalide ou expiré');
  }
}
}