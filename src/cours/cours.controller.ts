import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import * as fs from 'fs';

@UseGuards(AccessTokenGuard)
@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post()
  async create(@Body() createCourDto: CreateCourDto, @Res() response: Response) {
    try {
      const cour = await this.coursService.create(createCourDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Cours créé avec succès',
        cour,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || 'Erreur lors de la création du cours',
      });
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    try {
      const cours = await this.coursService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'Liste des cours récupérée avec succès',
        cours,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || 'Erreur lors de la récupération des cours',
      });
    }
  }

  @Get('search')
  async searchCourses(@Query('q') q: string, @Res() response: Response) {
    try {
      const cours = await this.coursService.searchCourses(q || '');
      return response.status(HttpStatus.OK).json({
        message: 'Résultats de recherche récupérés avec succès',
        cours,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || 'Erreur lors de la recherche',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      const cour = await this.coursService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'Cours récupéré avec succès',
        cour,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || 'Erreur lors de la récupération du cours',
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourDto: UpdateCourDto,
    @Res() response: Response,
  ) {
    try {
      const cour = await this.coursService.update(id, updateCourDto);
      return response.status(HttpStatus.OK).json({
        message: 'Cours modifié avec succès',
        cour,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || 'Erreur lors de la modification du cours',
      });
    }
  }

  @Patch(':id/approve')
  async approveCourse(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      const cour = await this.coursService.update(id, { status: 'published' });
      return response.status(HttpStatus.OK).json({
        message: 'Cours publié avec succès',
        cour,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de la publication',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      await this.coursService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: 'Cours supprimé avec succès',
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: error.message || 'Erreur lors de la suppression du cours',
      });
    }
  }

  @Post(':id/upload-pdf')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadDir = join(process.cwd(), 'uploads', 'pdfs');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `pdf-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/i)) {
          return callback(new BadRequestException('Seuls les fichiers PDF sont autorisés'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadPdf(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      if (!file) {
        return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Aucun fichier uploadé' });
      }

      const cour = await this.coursService.uploadPdf(id, file);
      return response.status(HttpStatus.OK).json({
        message: 'PDF uploadé avec succès',
        cour,
      });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id/download-pdf')
  async downloadPdf(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      const { pdfBuffer, filename } = await this.coursService.downloadPdf(id);
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
      return response.send(pdfBuffer);
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Delete(':id/pdf')
  async deletePdf(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      await this.coursService.deletePdf(id);
      return response.status(HttpStatus.OK).json({ message: 'PDF supprimé' });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id/pdf-info')
  async getPdfInfo(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      const pdfInfo = await this.coursService.getPdfInfo(id);
      return response.status(HttpStatus.OK).json({ pdfInfo });
    } catch (err) {
      const error = err as Error;
      return response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}