import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  username: string;

  @ApiModelProperty()
  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
}