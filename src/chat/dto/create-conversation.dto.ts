import { IsInt, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsInt()
  studentId!: number;

  @IsString()
  studentName!: string;

  @IsInt()
  teacherId!: number;

  @IsString()
  teacherName!: string;
}