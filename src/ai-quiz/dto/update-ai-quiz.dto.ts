import { PartialType } from '@nestjs/mapped-types';
import { CreateAiQuizDto } from './create-ai-quiz.dto';

export class UpdateAiQuizDto extends PartialType(CreateAiQuizDto) {}
