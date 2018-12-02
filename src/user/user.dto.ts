import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IdeaEntity } from '../idea/idea.entity';

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
  ideas?: IdeaEntity[];
  bookmarks?: IdeaEntity[];
}