import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image, News, Topic, User } from 'src/entities';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { JWTService } from 'src/configs';
import { JwtService } from '@nestjs/jwt';
import { ImageService } from '../image';
import { TopicService } from '../topic';
import { UserService } from '../user';
import { CloudService } from '../cloud';

@Module({
  imports: [TypeOrmModule.forFeature([News,User,Image,Topic])],
  providers: [NewsService, JWTService,JwtService, ImageService, TopicService,UserService, CloudService],
  controllers: [NewsController],
})
export class NewsModule {}
