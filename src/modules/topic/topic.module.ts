import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
})
export class TopicModule {}
