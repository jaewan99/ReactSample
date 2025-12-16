import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotesService } from './notes/notes.service';
import { NotesModule } from './notes/notes.module';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { LikesService } from './likes/likes.service';
import { LikesController } from './likes/likes.controller';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    NotesModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController, LikesController],
  providers: [AppService, CommentsService, LikesService],
})
export class AppModule {}
