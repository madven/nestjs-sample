import { Injectable } from '@nestjs/common';
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
    return this.todoRepositoy.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<TodoDTO>) {
    await this.todoRepositoy.update({ id }, data);
    return await this.todoRepositoy.findOne({ id });
  }

  async delete(id: string) {
    await this.todoRepositoy.delete({ id });
    return { deleted: true };
  }
}
