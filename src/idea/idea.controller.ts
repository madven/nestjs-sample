import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { CustomAuthGuard } from '../common/auth.guard';
import { User } from '../user/user.decorator';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@ApiUseTags('idea')
@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');
  constructor(private ideaService: IdeaService) { }

  private logData(options: any) {
    options.userId && this.logger.log('USERID ' + JSON.stringify(options.userId));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
  }

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(CustomAuthGuard)
  createIdea(@User('id') userId: string, @Body() data: IdeaDTO) {
    this.logData({ userId, data });
    return this.ideaService.create(userId, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(CustomAuthGuard)
  updateIdea(@User('id') userId: string, @Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    this.logData({ userId, data, id });
    return this.ideaService.update(userId, id, data);
  }

  @Delete(':id')
  @UseGuards(CustomAuthGuard)
  deleteIdea(@User('id') userId: string, @Param('id') id: string) {
    this.logData({ userId, id });
    return this.ideaService.delete(userId, id);
  }

  @Post(':id/bookmark')
  @UseGuards(CustomAuthGuard)
  bookmark(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ userId, id });
    return this.ideaService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(CustomAuthGuard)
  unbookmark(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ userId, id });
    return this.ideaService.unbookmark(id, userId);
  }

  @Post(':id/upvote')
  @UseGuards(CustomAuthGuard)
  upvoteIdea(@User('id') userId: string, @Param('id') id: string) {
    this.logData({ userId, id });
    return this.ideaService.upvote(userId, id);
  }

  @Post(':id/downvote')
  @UseGuards(CustomAuthGuard)
  downvoteIdea(@User('id') userId: string, @Param('id') id: string) {
    this.logData({ userId, id });
    return this.ideaService.downvote(userId, id);
  }
}
