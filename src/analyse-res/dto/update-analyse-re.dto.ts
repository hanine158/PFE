import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalyseReDto } from './create-analyse-re.dto';

export class UpdateAnalyseReDto extends PartialType(CreateAnalyseReDto) {}
