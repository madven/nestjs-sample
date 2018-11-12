import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';

import { TodoService } from './todo.service';
import { TodoDTO } from './todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) { }

  @Get()
  showAllTodos() {
    return this.todoService.showAll();
  }

  @Post()
  createTodo(@Body() data: TodoDTO) {
    return this.todoService.create(data);
  }

  @Get(':id')
  readTodo(@Param('id') id: string) {
    return this.todoService.read(id);
  }

  @Put(':id')
  updateTodo(@Param('id') id: string, @Body() data: Partial<TodoDTO>) {
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.delete(id);
  }
}
