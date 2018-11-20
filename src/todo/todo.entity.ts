import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  todo: string;

  @Column('text')
  description: string;

  @ManyToOne(type => UserEntity, author => author.todos)
  author: UserEntity;
}