import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, Logger } from '@nestjs/common';

import { TodoService } from './todo.service';
import { TodoDTO } from './todo.dto';
import { CustomValidationPipe } from 'util/validation.pipe';

@Controller('api/todos')
export class TodoController {
  private logger = new Logger('TodoController');
  constructor(private todoService: TodoService) { }

  @Get()
  showAllTodos() {
    return this.todoService.showAll();
  }

  @Post()
  @UsePipes(new CustomValidationPipe())
  createTodo(@Body() data: TodoDTO) {
    this.logger.log(`createTodo: ${JSON.stringify(data)}`);
    return this.todoService.create(data);
  }

  @Get(':id')
  readTodo(@Param('id') id: string) {
    return this.todoService.read(id);
  }

  @Put(':id')
  @UsePipes(new CustomValidationPipe())
  updateTodo(@Param('id') id: string, @Body() data: Partial<TodoDTO>) {
    this.logger.log(`updateTodo: ${JSON.stringify(data)}`);
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.delete(id);
  }
}
