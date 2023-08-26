import { NewsService } from './../news/news.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark, News, User } from 'src/entities';
import { Repository } from 'typeorm';
import { UuidOfUserDTO } from './dto';
import { getRandomSubset } from 'src/utils';
import { randomInt } from 'crypto';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>,
        private readonly newsService: NewsService
    ) {}

    //crud bookmark

    // create dummy bookmark
    async createDummyBookmark(user: User): Promise<Bookmark[]> {
        const bookmarks: Bookmark[] = [];
        const { uuid } = user;

        const news = await this.newsService.getAllNews();
        if (!news) return null;

        for (let i = 0; i < 10; i++) {
            const bookmark = new Bookmark({
                user: user,
            });
            bookmark.news = news[randomInt(0, news.length - 1)];
            bookmarks.push(bookmark);
        }
        const response = await this.bookmarkRepository.save(bookmarks);

        return response;
    }

    //get all bookmark of user
    async getAllBookmarkOfUser(
        uuidOfUserDTO: UuidOfUserDTO
    ): Promise<Bookmark[]> {
        const response = await this.bookmarkRepository.find();
        if (!response) return null;
        if (response.length === 0) return null;

        return response;
    }

    //get bookmark by id

    //create bookmark

    //update bookmark by id

    //delete bookmark by id

    //get bookmark by user id

    //get bookmark by user id and news id

    //get bookmark by news id

    //get bookmark by user id and topic id

    //get bookmark by topic id

    //get bookmark by user id and topic id and news id
}
