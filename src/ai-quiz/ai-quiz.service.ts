import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AiQuizService {
  private readonly fastApiUrl = 'http://127.0.0.1:8000';
  private readonly nestApiUrl = 'http://127.0.0.1:3001';

  async generateQuiz(file: Express.Multer.File) {
    try {
      const formData = new FormData();

      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post(
        `${this.fastApiUrl}/api/generate-quiz`,
        formData,
        {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur FastAPI:', error.response?.data || error.message);
      } else {
        console.error('Erreur inconnue:', error);
      }

      throw new InternalServerErrorException(
        'Erreur lors de la génération du quiz IA.',
      );
    }
  }

  private async sendPdfBufferToFastApi(fileBuffer: Buffer, filename: string) {
    const formData = new FormData();

    formData.append('file', fileBuffer, {
      filename,
      contentType: 'application/pdf',
    });

    const response = await axios.post(
      `${this.fastApiUrl}/api/generate-quiz`,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    );

    const result = response.data;

    if (!result?.success) {
      throw new BadRequestException(
        result?.error || 'FastAPI n’a pas pu générer le quiz.',
      );
    }

    return result;
  }

  private cleanPdfName(pdfValue: string): string {
    let cleanedPdf = String(pdfValue || '').trim();

    if (!cleanedPdf) {
      return '';
    }

    cleanedPdf = cleanedPdf.replace(/\\/g, '/');

    if (cleanedPdf.startsWith('http://') || cleanedPdf.startsWith('https://')) {
      cleanedPdf = path.basename(cleanedPdf);
    }

    if (cleanedPdf.includes('/')) {
      cleanedPdf = path.basename(cleanedPdf);
    }

    return cleanedPdf;
  }

  private buildPdfPathFromPdfValue(pdfValue: string): string | null {
    const root = process.cwd();
    const cleanedPdf = this.cleanPdfName(pdfValue);

    if (!cleanedPdf) {
      return null;
    }

    const possiblePaths = [
      path.join(root, 'uploads', 'pdfs', cleanedPdf),
      path.join(root, 'uploads', 'pdf', cleanedPdf),
      path.join(root, 'uploads', 'cours', cleanedPdf),
      path.join(root, 'uploads', 'courses', cleanedPdf),
      path.join(root, 'uploads', cleanedPdf),
      path.join(root, 'public', 'uploads', 'pdfs', cleanedPdf),
      path.join(root, 'public', 'uploads', cleanedPdf),
    ];

    console.log('Nom PDF reçu:', pdfValue);
    console.log('Nom PDF nettoyé:', cleanedPdf);
    console.log('Dossier backend:', root);
    console.log('Chemins PDF testés:', possiblePaths);

    const foundPath = possiblePaths.find((pdfPath) => fs.existsSync(pdfPath));

    if (!foundPath) {
      console.warn('PDF non trouvé localement avec ce nom:', cleanedPdf);
      return null;
    }

    console.log('PDF trouvé localement:', foundPath);

    return foundPath;
  }

  private async getCourseById(courseId: number): Promise<any | null> {
    try {
      const url = `${this.nestApiUrl}/cours/${courseId}`;
      console.log('Récupération du cours via route:', url);

      const response = await axios.get(url);
      const data = response.data;

      return data?.cour || data?.course || data?.data || data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.warn(
          'Impossible de récupérer le cours via GET /cours/:id',
          error.response?.status,
          error.response?.data || error.message,
        );
      } else {
        console.warn('Erreur inconnue récupération cours:', error);
      }

      return null;
    }
  }

  private async getPdfBufferFromCourseRoute(courseId: number): Promise<Buffer> {
    const routesToTry = [
      `${this.nestApiUrl}/cours/${courseId}/download-pdf`,
      `${this.nestApiUrl}/cours/${courseId}/pdf`,
    ];

    for (const url of routesToTry) {
      try {
        console.log('Tentative récupération PDF via route:', url);

        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        });

        console.log('PDF récupéré via route:', url);
        return Buffer.from(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.warn(
            'Route PDF échouée:',
            url,
            error.response?.status,
            error.message,
          );
        } else {
          console.warn('Erreur inconnue route PDF:', error);
        }
      }
    }

    throw new NotFoundException(
      `Impossible de récupérer le PDF du cours ${courseId}.`,
    );
  }

  async generateAndPublishQuiz(
    courseId: number,
    body?: { pdf?: string; titre?: string },
  ) {
    try {
      let fileBuffer: Buffer | null = null;
      let filename = `course-${courseId}.pdf`;

      if (body?.pdf && typeof body.pdf === 'string') {
        console.log('PDF reçu depuis React:', body.pdf);

        const pdfPathFromBody = this.buildPdfPathFromPdfValue(body.pdf);

        if (pdfPathFromBody) {
          fileBuffer = fs.readFileSync(pdfPathFromBody);
          filename = path.basename(pdfPathFromBody);
        }
      }

      if (!fileBuffer) {
        const course = await this.getCourseById(courseId);

        if (course) {
          console.log('Cours récupéré:', course);

          const coursePdf =
            course?.pdf ||
            course?.pdfPath ||
            course?.filePath ||
            course?.pdfUrl ||
            course?.fichier ||
            course?.file ||
            null;

          if (coursePdf && typeof coursePdf === 'string') {
            const pdfPathFromCourse = this.buildPdfPathFromPdfValue(coursePdf);

            if (pdfPathFromCourse) {
              fileBuffer = fs.readFileSync(pdfPathFromCourse);
              filename = path.basename(pdfPathFromCourse);
            }
          }
        }
      }

      if (!fileBuffer) {
        console.log('PDF local introuvable, récupération via route backend...');
        fileBuffer = await this.getPdfBufferFromCourseRoute(courseId);
      }

      const result = await this.sendPdfBufferToFastApi(fileBuffer, filename);

      return {
        success: true,
        message: 'Quiz généré par IA avec succès.',
        courseId,
        titre: body?.titre || `Quiz IA - cours ${courseId}`,
        status: 'published',
        questions: result.questions,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        console.error('Erreur Axios:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        throw new InternalServerErrorException(
          JSON.stringify(error.response?.data || error.message),
        );
      }

      console.error('Erreur génération quiz course:', error);

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Erreur inconnue lors de la génération du quiz IA.',
      );
    }
  }
}