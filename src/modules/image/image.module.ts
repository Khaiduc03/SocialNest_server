import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entities';

@Module({
  imports:[
    TypeOrmModule.forFeature([Image])
  ]


})
export class ImageModule {}
