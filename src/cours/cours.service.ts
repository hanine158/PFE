// src/cours/cours.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cour } from './entities/cour.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Pdfdoc } from '../pdfdoc/entities/pdfdoc.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CoursService {
  constructor(
    @InjectRepository(Cour) private courRepository: Repository<Cour>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pdfdoc) private pdfRepository: Repository<Pdfdoc>,
  ) {}

  async create(createCourDto: CreateCourDto): Promise<Cour> {
    const user = await this.userRepository.findOne({ 
      where: { id: createCourDto.user }, 
      relations: ["cours"] 
    });
    
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
    
    const cour = this.courRepository.create({ 
      titre: createCourDto.titre,
      user 
    });
    
    return this.courRepository.save(cour);
  }

  async findAll(): Promise<Cour[]> {
    const cours = await this.courRepository.find({
      relations: ['user', 'pdf']
    });
    return cours;
  }

  async findOne(id: number): Promise<Cour> {
    const cour = await this.courRepository.findOne({
      where: { id },
      relations: ['user', 'pdf']
    });
    
    if (!cour) {
      throw new NotFoundException("Cours non trouvé");
    }
    return cour;
  }

  async update(id: number, updateCourDto: UpdateCourDto): Promise<Cour> {
    const cour = await this.findOne(id);
    Object.assign(cour, updateCourDto);
    return this.courRepository.save(cour);
  }

  async remove(id: number): Promise<Cour> {
    const cour = await this.findOne(id);
    return this.courRepository.remove(cour);
  }

  // 📤 Upload PDF
  async uploadPdf(id: number, file: Express.Multer.File): Promise<Cour> {
    const cour = await this.findOne(id);
    
    if (!cour) {
      throw new NotFoundException("Cours non trouvé");
    }

    // Créer le dossier uploads/pdfs s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'uploads', 'pdfs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Si un PDF existe déjà, supprimer l'ancien fichier
    if (cour.pdf) {
      const oldPdfPath = path.join(process.cwd(), cour.pdf.filePath);
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
      }
      await this.pdfRepository.remove(cour.pdf);
      cour.pdf = null as any; // ✅ Solution temporaire
    }

    // Créer le nouveau PDF
    const pdf = new Pdfdoc();
    pdf.filename = file.filename;
    pdf.originalName = file.originalname;
    pdf.filePath = file.path;
    pdf.fileSize = file.size;
    pdf.mimeType = file.mimetype;
    pdf.cours = cour;

    const savedPdf = await this.pdfRepository.save(pdf);
    cour.pdf = savedPdf;
    
    return this.courRepository.save(cour);
  }

  // 📥 Download PDF
  async downloadPdf(id: number): Promise<{ pdfBuffer: Buffer; filename: string }> {
    const cour = await this.findOne(id);
    
    if (!cour || !cour.pdf) {
      throw new NotFoundException("Aucun PDF trouvé pour ce cours");
    }

    const pdfPath = path.join(process.cwd(), cour.pdf.filePath);
    
    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException("Le fichier PDF n'existe plus sur le serveur");
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    return {
      pdfBuffer,
      filename: `${cour.titre}.pdf`
    };
  }

  // 🗑️ Delete PDF
  async deletePdf(id: number): Promise<void> {
    const cour = await this.findOne(id);
    
    if (!cour || !cour.pdf) {
      throw new NotFoundException("Aucun PDF trouvé pour ce cours");
    }

    // Supprimer le fichier physique
    const pdfPath = path.join(process.cwd(), cour.pdf.filePath);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    // Supprimer l'entrée en base de données
    await this.pdfRepository.remove(cour.pdf);
    cour.pdf = null as any; // ✅ Solution temporaire
    await this.courRepository.save(cour);
  }

  // ℹ️ Get PDF Info
  async getPdfInfo(id: number) {
    const cour = await this.findOne(id);
    
    if (!cour || !cour.pdf) {
      throw new NotFoundException("Aucun PDF trouvé pour ce cours");
    }

    return {
      id: cour.pdf.id,
      originalName: cour.pdf.originalName,
      filename: cour.pdf.filename,
      fileSize: cour.pdf.fileSize,
      uploadedAt: cour.pdf.createdAt
    };
  }
}