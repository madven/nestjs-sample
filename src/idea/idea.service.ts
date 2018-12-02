import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Votes } from '../common/votes.enum';
import { UserEntity } from '../user/user.entity';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>) { }

  private toResponseObject(idea: IdeaEntity): IdeaRO {
    const resObj: any = { ...idea, author: idea.author ? idea.author.toResponseObject() : null };
    if (idea.upvotes)
      resObj.upvotes = idea.upvotes.length;
    if (idea.downvotes)
      resObj.downvotes = idea.downvotes.length;
    if (idea.comments)
      resObj.comments = idea.comments.map(comment =>
        comment = { ...comment, author: comment.author ? comment.author.toResponseObject() : null });
    return resObj;
  }

  private checkOwner(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId)
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
  }

  private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }

    return idea;
  }

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments', 'comments.author'],
    });
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(userId: string, data: IdeaDTO): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async read(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return this.toResponseObject(idea);
  }

  async update(userId: string, id: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
    let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    this.checkOwner(idea, userId);
    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] });
    return this.toResponseObject(idea);
  }

  async delete(userId: string, id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    this.checkOwner(idea, userId);
    await this.ideaRepository.delete({ id });
    return this.toResponseObject(idea);
  }

  async bookmark(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }

  async unbookmark(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Idea is not bookmarked', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }

  async upvote(userId: string, id: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, Votes.UP);
    return this.toResponseObject(idea);
  }

  async downvote(userId: string, id: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    if (!idea)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, Votes.DOWN);
    return this.toResponseObject(idea);
  }
}
