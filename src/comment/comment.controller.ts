import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CustomAuthGuard } from '../common/auth.guard';
import { CustomValidationPipe } from '../common/validation.pipe';
import { User } from '../user/user.decorator';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('api/comments')
export class CommentController {
  constructor(private commentService: CommentService) { }

  @Get('idea/:id')
  showCommentsByIdea(@Param('id') ideaId: string, @Query('page') page: number) {
    return this.commentService.showByIdea(ideaId, page);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') userId: string, @Query('page') page: number) {
    return this.commentService.showByUser(userId, page);
  }

  @Post('idea/:id')
  @UseGuards(CustomAuthGuard)
  @UsePipes(CustomValidationPipe)
  createComment(@User('id') userId: string, @Param('id') ideaId: string, @Body() data: CommentDTO) {
    return this.commentService.create(userId, ideaId, data);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(CustomAuthGuard)
  destroyComment(@User('id') userId: string, @Param('id') id: string) {
    return this.commentService.destroy(userId, id);
  }
}
