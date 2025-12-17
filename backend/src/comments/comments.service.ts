import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(noteId: number, userId: number, content: string) {
    return this.prisma.comment.create({
      data: { noteId, userId, content },
    });
  }

  async findByNote(noteId: number) {
    return this.prisma.comment.findMany({
      where: { noteId },
      include: { User: true },
    });
  }

  async delete(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async update(id: number, content: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }
}
