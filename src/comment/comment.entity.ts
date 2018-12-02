import { IdeaEntity } from 'idea/idea.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'user/user.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  comment: string;

  @ManyToOne(type => UserEntity)
  author: UserEntity;

  @ManyToOne(type => IdeaEntity, idea => idea.comments)
  idea: IdeaEntity;
}