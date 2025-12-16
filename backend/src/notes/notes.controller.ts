import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createNote(
    @Body() body: { title: string; content: string },
    @Request() req,
  ) {
    return this.notesService.createNote({
      title: body.title,
      content: body.content,
      authorId: req.user.id, // Get from JWT token
    });
  }

  @Get()
  async getAllNotes() {
    return this.notesService.findAllNotes();
  }

  @Get(':id')
  async getNoteById(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findNoteById(id);
  }

  @Get('user/:authorId')
  async getNotesByAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.notesService.findNotesByAuthor(authorId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title?: string; content?: string },
  ) {
    return this.notesService.updateNote(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteNote(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.deleteNote(id);
  }
}
