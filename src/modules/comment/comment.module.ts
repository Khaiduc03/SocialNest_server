import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities';

@Module({ imports: [TypeOrmModule.forFeature([Comment])] })
export class CommentModule {}
