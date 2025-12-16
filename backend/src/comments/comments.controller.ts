import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':noteId')
  create(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.commentsService.create(noteId, req.user.id, content);
  }

  @Get('note/:noteId')
  findByNote(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.commentsService.findByNote(noteId);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}
