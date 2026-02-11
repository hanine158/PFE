import { PartialType } from '@nestjs/mapped-types';
import { CreatePdfdocDto } from './create-pdfdoc.dto';

export class UpdatePdfdocDto extends PartialType(CreatePdfdocDto) {}
