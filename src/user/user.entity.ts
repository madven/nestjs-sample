import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TodoEntity } from '../todo/todo.entity';
import { UserRO } from './user.dto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => TodoEntity, todo => todo.author)
  todos: TodoEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = false): UserRO {
    const { id, created, username, token } = this;
    const responseObject: UserRO = { id, created, username };
    if (showToken)
      responseObject.token = token;
    if (this.todos)
      responseObject.todos = this.todos;
    return responseObject;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }
}