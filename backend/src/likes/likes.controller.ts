import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('likes')
@UseGuards(AuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':noteId')
  toggle(@Param('noteId', ParseIntPipe) noteId: number, @Request() req) {
    return this.likesService.toggle(noteId, req.user.id);
  }

  @Get('note/:noteId')
  count(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.likesService.countByNote(noteId);
  }
}
