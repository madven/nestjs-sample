import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { TodoController } from './todo.controller';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';


@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity, UserEntity])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule { }
