import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TodoDTO, TodoRO } from './todo.dto';
import { TodoEntity } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(TodoEntity) private todoRepositoy: Repository<TodoEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { } // tslint:disable-line

  private toResponseObject(todo: TodoEntity): TodoRO {
    return { ...todo, author: todo.author.toResponseObject() };
  }

  private checkOwner(todo: TodoEntity, userId: string) {
    if (todo.author.id !== userId)
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
  }

  async showAll(): Promise<TodoRO[]> {
    const todos = await this.todoRepositoy.find({ relations: ['author'] });
    return todos.map(todo => this.toResponseObject(todo));
  }

  async create(userId: string, data: TodoDTO): Promise<TodoRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const todo = await this.todoRepositoy.create({ ...data, author: user });
    await this.todoRepositoy.save(todo);
    return this.toResponseObject(todo);
  }

  async read(id: string): Promise<TodoRO> {
    const todo = await this.todoRepositoy.findOne({ where: { id }, relations: ['author'] });
    if (!todo)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return this.toResponseObject(todo);
  }

  async update(userId: string, id: string, data: Partial<TodoDTO>): Promise<TodoRO> {
    let todo = await this.todoRepositoy.findOne({ where: { id }, relations: ['author'] });
    if (!todo)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    this.checkOwner(todo, userId);
    await this.todoRepositoy.update({ id }, data);
    todo = await this.todoRepositoy.findOne({ where: { id }, relations: ['author'] });
    return this.toResponseObject(todo);
  }

  async delete(userId: string, id: string): Promise<TodoRO> {
    const todo = await this.todoRepositoy.findOne({ where: { id }, relations: ['author'] });
    if (!todo)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    this.checkOwner(todo, userId);
    await this.todoRepositoy.delete({ id });
    return this.toResponseObject(todo);
  }
}
