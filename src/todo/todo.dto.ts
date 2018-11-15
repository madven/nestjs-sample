import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class TodoDTO {
  @ApiModelProperty()
  @IsString()
  todo: string;

  @ApiModelProperty()
  @IsString()
  description: string;
}