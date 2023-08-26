import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from 'src/entities';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { NewsModule } from '../news';
import { NewsService } from '../news/news.service';
import { TypeOrmModule1 } from '../typeorm/typeorm.module';
import { JWTService } from 'src/configs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user';

@Module({
    imports: [TypeOrmModule.forFeature([Bookmark]), NewsModule, TypeOrmModule1],
    providers: [
        BookmarkService,
        NewsService,
        JWTService,
        JwtService,
        UserService,
    ],
    controllers: [BookmarkController],
})
export class BookmarkModule {}
