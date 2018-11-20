import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TodoEntity } from '../todo/todo.entity';

export class UserDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  todos?: TodoEntity[];
}