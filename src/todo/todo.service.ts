import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TodoEntity } from './todo.entity';
import { TodoDTO } from './todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(TodoEntity) private todoRepositoy: Repository<TodoEntity>) { }

  async showAll() {
    return await this.todoRepositoy.find();
  }

  async create(data: TodoDTO) {
    const todo = await this.todoRepositoy.create(data);
    await this.todoRepositoy.save(todo);
    return todo;
  }

  async read(id: string) {
    const todo = await this.todoRepositoy.findOne({ where: { id } });
    if (!todo)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return todo;
  }

  async update(id: string, data: Partial<TodoDTO>) {
    let todo = await this.todoRepositoy.findOne({ where: { id } });
    if (!todo)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    await this.todoRepositoy.update({ id }, data);
    todo = await this.todoRepositoy.findOne({ id });
    return todo;
  }

  async delete(id: string) {
    const todo = await this.todoRepositoy.findOne({ where: { id } });
    if (!todo)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    await this.todoRepositoy.delete({ id });
    return todo;
  }
}
