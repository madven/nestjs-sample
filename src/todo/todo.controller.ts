import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import { CustomAuthGuard } from '../util/auth.guard';
import { TodoDTO } from './todo.dto';
import { TodoService } from './todo.service';

@ApiUseTags('todo')
@Controller('api/todos')
export class TodoController {
  private logger = new Logger('TodoController');
  constructor(private todoService: TodoService) { }

  private logData(options: any) {
    options.userId && this.logger.log('USERID ' + JSON.stringify(options.userId));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    options.id && this.logger.log('TODO ' + JSON.stringify(options.id));
  }

  @Get()
  showAllTodos() {
    return this.todoService.showAll();
  }

  @Post()
  @UseGuards(CustomAuthGuard)
  createTodo(@User('id') userId: string, @Body() data: TodoDTO) {
    this.logData({ userId, data });
    return this.todoService.create(userId, data);
  }

  @Get(':id')
  readTodo(@Param('id') id: string) {
    return this.todoService.read(id);
  }

  @Put(':id')
  @UseGuards(CustomAuthGuard)
  updateTodo(@User('id') userId: string, @Param('id') id: string, @Body() data: Partial<TodoDTO>) {
    this.logData({ userId, data, id });
    return this.todoService.update(userId, id, data);
  }

  @Delete(':id')
  @UseGuards(CustomAuthGuard)
  deleteTodo(@User('id') userId: string, @Param('id') id: string) {
    this.logData({ userId, id });
    return this.todoService.delete(userId, id);
  }
}
