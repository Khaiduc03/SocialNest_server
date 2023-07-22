import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Re_comment } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Re_comment])],
})
export class ReCommentModule {}
