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
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return this.commentsService.update(id, content);
  }
}
