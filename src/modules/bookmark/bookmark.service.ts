import { NewsService } from './../news/news.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark, News, User } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateBookmarkDTO, UuidOfUserDTO } from './dto';
import { getRandomSubset } from 'src/utils';
import { randomInt } from 'crypto';
import { th } from '@faker-js/faker';

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
        const response = await this.bookmarkRepository.find({
            where: {
                user: {
                    uuid: uuidOfUserDTO.user_uuid,
                },
            },
            relations: ['news'],
        });
        if (!response) return null;
        if (response.length === 0) return null;

        return response;
    }

    //get bookmark by id

    //create bookmark
    async createBookMark(
        createBookmarkDTO: CreateBookmarkDTO,
        user: User
    ): Promise<Bookmark> {
        try {
            const newItem = await this.newsService.getNewsById(
                createBookmarkDTO.news_uuid
            );
            if (!newItem) return null;

            const bookmark = new Bookmark({
                user: user,
            });
            bookmark.news = newItem;
            if (!bookmark) return null;
            const response = await this.bookmarkRepository.save(bookmark);
            if (!response) return null;
            return response;
        } catch (error) {
            throw error;
        }
    }

    //update bookmark by id

    //delete bookmark by id

    //get bookmark by user id

    //get bookmark by user id and news id

    //get bookmark by news id

    //get bookmark by user id and topic id

    //get bookmark by topic id

    //get bookmark by user id and topic id and news id
}
