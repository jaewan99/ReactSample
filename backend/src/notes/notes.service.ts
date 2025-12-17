import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Note } from 'src/generated/prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(data: {
    title: string;
    content: string;
    authorId: number;
  }): Promise<Note> {
    return this.prisma.note.create({
      data,
    });
  }

  async findNoteById(id: number): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: { id },
      include: {
        User: true, // Include author info
        Comment: true,
        Like: true,
      },
    });
  }

  async findAllNotes(): Promise<Note[]> {
    return this.prisma.note.findMany({
      include: {
        User: true,
        Comment: true,
        Like: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findNotesByAuthor(authorId: number): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { authorId },
      include: {
        User: true,
        Comment: true,
        Like: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateNote(
    id: number,
    data: { title?: string; content?: string },
  ): Promise<Note> {
    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  async deleteNote(id: number): Promise<Note> {
    return this.prisma.note.delete({
      where: { id },
    });
  }
}
