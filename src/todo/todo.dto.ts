import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserRO } from 'user/user.dto';

export class TodoDTO {
  @ApiModelProperty()
  @IsString()
  todo: string;

  @ApiModelProperty()
  @IsString()
  description: string;
}

export class TodoRO {
  id?: string;
  created: Date;
  updated: Date;
  todo: string;
  description: string;
  author: UserRO;
}