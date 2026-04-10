// src/cours/cours.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import * as fs from 'fs';

// ⚠️ TEMPORAIRE: Commenté pour permettre les tests sans authentification
// @UseGuards(AccessTokenGuard)
@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post()
  async create(@Body() createCourDto: CreateCourDto, @Res() response: Response) {
    try {
      console.log('📝 Création cours:', createCourDto);
      const cour = await this.coursService.create(createCourDto);
      return response.status(HttpStatus.CREATED).json({
        message: "Cours créé avec succès",
        cour
      });
    } catch (err) {
      const error = err as Error;
      console.error('❌ Erreur création:', error.message);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || "Erreur lors de la création du cours",
      });
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    try {
      const cours = await this.coursService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "Liste des cours récupérée avec succès",
        cours
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || "Erreur lors de la récupération des cours",
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response: Response) {
    try {
      const cour = await this.coursService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "Cours récupéré avec succès",
        cour
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || "Erreur lors de la récupération du cours",
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCourDto: UpdateCourDto, @Res() response: Response) {
    try {
      const cour = await this.coursService.update(id, updateCourDto);
      return response.status(HttpStatus.OK).json({
        message: "Cours modifié avec succès",
        cour
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || "Erreur lors de la modification du cours",
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response: Response) {
    try {
      const cour = await this.coursService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "Cours supprimé avec succès",
        cour
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || "Erreur lors de la suppression du cours",
      });
    }
  }

  // 📤 UPLOAD PDF
  @Post(':id/upload-pdf')
  @UseInterceptors(FileInterceptor('pdf', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadDir = join(process.cwd(), 'uploads', 'pdfs');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log(`📁 Dossier créé: ${uploadDir}`);
        }
        callback(null, uploadDir);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `pdf-${uniqueSuffix}${ext}`;
        callback(null, filename);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf)$/i)) {
        return callback(new BadRequestException('Seuls les fichiers PDF sont autorisés'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  }))
  async uploadPdf(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response
  ) {
    try {
      if (!file) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Aucun fichier uploadé'
        });
      }

      console.log(`📄 Fichier reçu: ${file.originalname}`);
      console.log(`💾 Sauvegardé dans: ${file.path}`);
      
      const cour = await this.coursService.uploadPdf(id, file);
      
      return response.status(HttpStatus.OK).json({
        message: 'PDF uploadé avec succès',
        cour,
        file: {
          originalName: file.originalname,
          size: file.size,
          path: file.path
        }
      });
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Erreur upload: ${error.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de l\'upload du PDF'
      });
    }
  }

  // 📥 DOWNLOAD PDF
  @Get(':id/download-pdf')
  async downloadPdf(@Param('id') id: number, @Res() response: Response) {
    try {
      const { pdfBuffer, filename } = await this.coursService.downloadPdf(id);
      
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      response.setHeader('Content-Length', pdfBuffer.length);
      
      return response.send(pdfBuffer);
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.NOT_FOUND).json({
        message: error.message || 'PDF non trouvé'
      });
    }
  }

  // 🗑️ DELETE PDF
  @Delete(':id/pdf')
  async deletePdf(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.coursService.deletePdf(id);
      return response.status(HttpStatus.OK).json({
        message: 'PDF supprimé avec succès'
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de la suppression du PDF'
      });
    }
  }

  // ℹ️ GET PDF INFO
  @Get(':id/pdf-info')
  async getPdfInfo(@Param('id') id: number, @Res() response: Response) {
    try {
      const pdfInfo = await this.coursService.getPdfInfo(id);
      return response.status(HttpStatus.OK).json({
        message: 'Informations PDF récupérées',
        pdfInfo
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.NOT_FOUND).json({
        message: error.message || 'PDF non trouvé'
      });
    }
  }
}