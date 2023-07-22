import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
})
export class NewsModule {}
