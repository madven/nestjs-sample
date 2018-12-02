import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'idea/idea.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'user/user.entity';
import { CommentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  private toResponseObject(comment: CommentEntity) {
    return { ...comment, author: comment.author ? comment.author.toResponseObject() : null };
  }

  async showByIdea(ideaId: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id: ideaId },
      relations: ['comments', 'comments.author', 'comments.idea'],
    });

    return idea.comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string) {
    const comments = await this.commentRepository.find({
      where: { author: userId },
      relations: ['author'],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string) {
    return await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });
  }

  async create(userId: string, ideaId: string, data: CommentDTO) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const comment = await this.commentRepository.create({
      ...data, author: user, idea,
    });
    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async destroy(userId: string, id: string) {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });

    if (comment.author.id !== userId) {
      throw new HttpException('You do not own this comment!', HttpStatus.UNAUTHORIZED);
    }

    await this.commentRepository.remove(comment);
    return this.toResponseObject(comment);
  }
}
