import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follows } from 'src/entities';

@Module({
  imports:[
    TypeOrmModule.forFeature([Follows])
  ]


})
export class FollowsModule {}
