import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(noteId: number, userId: number) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_noteId: { userId, noteId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await this.prisma.like.create({ data: { noteId, userId } });
    return { liked: true };
  }

  async countByNote(noteId: number) {
    return this.prisma.like.count({ where: { noteId } });
  }
}
