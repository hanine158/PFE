import { IsIn, IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  conversationId!: number;

  @IsInt()
  senderId!: number;

  @IsIn(['student', 'teacher'])
  senderRole!: 'student' | 'teacher';

  @IsString()
  text!: string;
}