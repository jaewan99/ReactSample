import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByName(name: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }
}
