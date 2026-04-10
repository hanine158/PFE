import { BadRequestException, Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Cette méthode s'exécute automatiquement au démarrage du module
  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  // Création de l'administrateur par défaut
  async createDefaultAdmin(): Promise<void> {
    try {
      const adminEmail = 'hanine@gmail.com';
      
      // Vérifier si l'admin existe déjà
      const existingAdmin = await this.userRepository.findOne({ 
        where: { email: adminEmail } 
      });

      if (!existingAdmin) {
        this.logger.log('📝 Création de l\'administrateur par défaut...');
        
        // Créer l'admin (le mot de passe sera hashé automatiquement par @BeforeInsert)
        const admin = this.userRepository.create({
          name: 'Hanine',
          email: adminEmail,
          password: 'admin123', // Sera hashé automatiquement par l'entité
          role: UserRole.ADMIN,
        });
        
        await this.userRepository.save(admin);
        
        this.logger.log('✅ Administrateur par défaut créé avec succès');
        this.logger.log(`   📧 Email: ${adminEmail}`);
        this.logger.log(`   🔑 Mot de passe: admin123`);
        this.logger.log(`   👑 Rôle: ${UserRole.ADMIN}`);
      } else {
        this.logger.log('ℹ️ L\'administrateur existe déjà');
        
        // Vérifier si le rôle est bien ADMIN
        if (existingAdmin.role !== UserRole.ADMIN) {
          this.logger.warn('⚠️ Mise à jour du rôle utilisateur vers ADMIN...');
          existingAdmin.role = UserRole.ADMIN;
          await this.userRepository.save(existingAdmin);
          this.logger.log('✅ Rôle mis à jour vers ADMIN');
        }
        
        // Vérifier si le mot de passe est correct (optionnel)
        const isPasswordValid = await argon2.verify(existingAdmin.password, 'admin123');
        if (!isPasswordValid) {
          this.logger.warn('⚠️ Mise à jour du mot de passe admin...');
          existingAdmin.password = 'admin123'; // Sera hashé automatiquement
          await this.userRepository.save(existingAdmin);
          this.logger.log('✅ Mot de passe admin mis à jour');
        }
      }
    } catch (error) {
      // ✅ Correction: Vérifier le type de l'erreur
      if (error instanceof Error) {
        this.logger.error(`❌ Erreur lors de la création de l'admin: ${error.message}`);
      } else {
        this.logger.error(`❌ Erreur inconnue lors de la création de l'admin: ${JSON.stringify(error)}`);
      }
    }
  }

  // Création d'un utilisateur
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Vérifie si l'email existe déjà
      const existingUser = await this.userRepository.findOne({ 
        where: { email: createUserDto.email } 
      });
      
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // Convertir le rôle en enum si nécessaire
      let role: UserRole = UserRole.STUDENT;
      if (createUserDto.role === 'teacher') role = UserRole.TEACHER;
      if (createUserDto.role === 'admin') role = UserRole.ADMIN;

      const newUser = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password, // Sera hashé par @BeforeInsert
        role: role,
      });
      
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Erreur lors de la création: ${error.message}`);
      }
      throw new BadRequestException('Erreur inconnue lors de la création');
    }
  }

  // Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new NotFoundException("No users found");
    }
    return users;
  }

  // Récupérer un utilisateur par ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Récupérer un utilisateur par email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Récupérer un utilisateur par email (sans erreur)
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // Mettre à jour un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      
      if (updateUserDto.name) user.name = updateUserDto.name;
      if (updateUserDto.email) user.email = updateUserDto.email;
      if (updateUserDto.password) user.password = updateUserDto.password; // Sera hashé
      if (updateUserDto.role) {
        if (updateUserDto.role === 'teacher') user.role = UserRole.TEACHER;
        else if (updateUserDto.role === 'admin') user.role = UserRole.ADMIN;
        else user.role = UserRole.STUDENT;
      }
      
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Erreur lors de la mise à jour: ${error.message}`);
      }
      throw new BadRequestException('Erreur inconnue lors de la mise à jour');
    }
  }

  // Supprimer un utilisateur
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  // Mettre à jour le refresh token
  async updateToken(id: number, token: string): Promise<User> {
    const user = await this.findOne(id);
    user.refreshToken = token;
    return await this.userRepository.save(user);
  }

  // Validation login (hash password avec argon2)
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    return user;
  }

  // Sauvegarder un utilisateur
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}