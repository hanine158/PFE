import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cour } from './entities/cour.entity';
import { ILike, Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Pdfdoc } from '../pdfdoc/entities/pdfdoc.entity';
import * as fs from 'fs';

import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service';
import {
  NotificationPriority,
  NotificationType,
} from '../admin-notifications/entities/admin-notification.entity';

@Injectable()
export class CoursService {
  constructor(
    @InjectRepository(Cour)
    private readonly courRepository: Repository<Cour>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Pdfdoc)
    private readonly pdfRepository: Repository<Pdfdoc>,

    private readonly adminNotificationsService: AdminNotificationsService,
  ) {}

  async create(createCourDto: CreateCourDto): Promise<Cour> {
    const user = await this.userRepository.findOne({
      where: { id: createCourDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const cour = this.courRepository.create({
      titre: createCourDto.titre,
      description: createCourDto.description ?? '',
      category: createCourDto.category ?? 'Général',
      price: createCourDto.price ?? 0,
      status: createCourDto.status ?? 'pending',
      user,
    });

    const savedCour = await this.courRepository.save(cour);

    await this.adminNotificationsService.create({
      title: 'Nouveau cours publié',
      message: `Le cours "${savedCour.titre}" a été publié par ${user.name}`,
      type: NotificationType.COURSE,
      priority: user.role === UserRole.TEACHER
        ? NotificationPriority.MEDIUM
        : NotificationPriority.LOW,
      icon: '📚',
      actionUrl: `/admin/courses/${savedCour.id}`,
    });

    return savedCour;
  }

  async findAll(): Promise<Cour[]> {
    return await this.courRepository.find({
      relations: ['user', 'pdf'],
      order: { createdAt: 'DESC' },
    });
  }

  async searchCourses(query: string): Promise<Cour[]> {
    const q = query.trim();

    if (!q) {
      return [];
    }

    return await this.courRepository.find({
      where: [
        { titre: ILike(`%${q}%`) },
        { description: ILike(`%${q}%`) },
        { category: ILike(`%${q}%`) },
      ],
      relations: ['user', 'pdf'],
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async findOne(id: number): Promise<Cour> {
    const cour = await this.courRepository.findOne({
      where: { id },
      relations: ['user', 'pdf'],
    });

    if (!cour) {
      throw new NotFoundException('Cours non trouvé');
    }

    return cour;
  }

  async update(id: number, updateCourDto: UpdateCourDto): Promise<Cour> {
    const cour = await this.findOne(id);

    if (updateCourDto.userId !== undefined) {
      const user = await this.userRepository.findOne({
        where: { id: updateCourDto.userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      cour.user = user;
    }

    if (updateCourDto.titre !== undefined) cour.titre = updateCourDto.titre;
    if (updateCourDto.description !== undefined) cour.description = updateCourDto.description;
    if (updateCourDto.category !== undefined) cour.category = updateCourDto.category;
    if (updateCourDto.price !== undefined) cour.price = updateCourDto.price;
    if (updateCourDto.status !== undefined) cour.status = updateCourDto.status;

    return await this.courRepository.save(cour);
  }

  async remove(id: number): Promise<void> {
    const cour = await this.findOne(id);

    if (cour.pdf) {
      const pdfPath = cour.pdf.filePath;
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
      await this.pdfRepository.remove(cour.pdf);
    }

    await this.courRepository.remove(cour);
  }

  async uploadPdf(id: number, file: Express.Multer.File): Promise<Cour> {
    const cour = await this.findOne(id);

    if (cour.pdf) {
      const oldPdfPath = cour.pdf.filePath;
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
      }
      await this.pdfRepository.remove(cour.pdf);
      cour.pdf = null;
    }

    const pdf = this.pdfRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      status: 'available',
      cours: cour,
    });

    const savedPdf = await this.pdfRepository.save(pdf);
    cour.pdf = savedPdf;

    return await this.courRepository.save(cour);
  }

  async getAvailablePdfs(): Promise<any[]> {
    const pdfs = await this.pdfRepository.find({
      relations: ['cours', 'cours.user'],
      order: { createdAt: 'DESC' },
    });

    return pdfs.map((pdf) => ({
      id: pdf.id,
      courseId: pdf.cours?.id,
      courseTitle: pdf.cours?.titre,
      teacherName: pdf.cours?.user?.name,
      fileName: pdf.originalName,
      fileSize: pdf.fileSize,
      uploadDate: pdf.createdAt,
      status: pdf.status,
    }));
  }

  async downloadPdf(id: number): Promise<{ pdfBuffer: Buffer; filename: string }> {
    const cour = await this.findOne(id);

    if (!cour.pdf) {
      throw new NotFoundException('Aucun PDF trouvé pour ce cours');
    }

    const pdfPath = cour.pdf.filePath;

    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException("Le fichier PDF n'existe plus sur le serveur");
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    return {
      pdfBuffer,
      filename: cour.pdf.originalName || `${cour.titre}.pdf`,
    };
  }

  async deletePdf(id: number): Promise<void> {
    const cour = await this.findOne(id);

    if (!cour.pdf) {
      throw new NotFoundException('Aucun PDF trouvé pour ce cours');
    }

    const pdfPath = cour.pdf.filePath;
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    await this.pdfRepository.remove(cour.pdf);
    cour.pdf = null;
    await this.courRepository.save(cour);
  }

  async getPdfInfo(id: number) {
    const cour = await this.findOne(id);

    if (!cour.pdf) {
      throw new NotFoundException('Aucun PDF trouvé pour ce cours');
    }

    return {
      id: cour.pdf.id,
      originalName: cour.pdf.originalName,
      filename: cour.pdf.filename,
      fileSize: cour.pdf.fileSize,
      status: cour.pdf.status,
      uploadedAt: cour.pdf.createdAt,
    };
  }
}