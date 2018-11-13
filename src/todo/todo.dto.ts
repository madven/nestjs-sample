import { IsString } from 'class-validator';

export class TodoDTO {
  @IsString()
  todo: string;

  @IsString()
  description: string;
}