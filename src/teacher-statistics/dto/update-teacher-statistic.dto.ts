import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherStatisticDto } from './create-teacher-statistic.dto';

export class UpdateTeacherStatisticDto extends PartialType(CreateTeacherStatisticDto) {}
