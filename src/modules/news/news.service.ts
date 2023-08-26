import { fakerVI } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';
import { News, Topic, User } from 'src/entities';
import { getRandomSubset } from 'src/utils';
import { Repository } from 'typeorm';
import { ImageService } from '../image';
import { TopicService } from '../topic';
import { UserService } from '../user/user.service';
import { CreateNewsDTO, PageDTO, UpdateNewsDTO, UuidDTO } from './dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
        private readonly imageService: ImageService,
        private readonly userService: UserService,
        private readonly topicService: TopicService,
        @InjectRepository(Topic)
        private topicRepository: Repository<Topic>
    ) {}

    //crud news
    async getAllNews(): Promise<News[]> {
        try {
            const news = await this.newsRepository
                .createQueryBuilder('news')
                // .leftJoinAndSelect('news.image', 'image')
                // .leftJoinAndSelect('news.owner', 'owner')
                // .leftJoinAndSelect('owner.avatar', 'avatar')
                // .leftJoinAndSelect('news.topics', 'topics')
                .getMany();

            if (!news) return null;

            return news;
        } catch (error) {
            throw new error.message();
        }
    }

    async getAllNewsWithPage(pageDTO: PageDTO): Promise<Http> {
        try {
            const page = pageDTO.page;

            const perPage = 15;
            const skip = (page - 1) * perPage;

            const news = await this.newsRepository
                .createQueryBuilder('news')
                .leftJoinAndSelect('news.image', 'image')
                .leftJoinAndSelect('news.owner', 'owner')
                .leftJoinAndSelect('owner.avatar', 'avatar')
                .leftJoinAndSelect('news.topics', 'topics')
                .skip(skip)
                .take(perPage)
                .orderBy('news.createdAt', 'DESC')
                .getMany();

            if (!news) return createBadRequset('Get news all');

            await this.responseOfNews(news);

            return createSuccessResponse(news.length, 'Get news all');
        } catch (error) {
            return createBadRequsetNoMess(error);
        }
    }

    async getNewsById(uuid: string): Promise<Http> {
        try {
            const news = await this.newsRepository.findOne({
                where: { uuid },
            });
            if (!news) return createBadRequset('Get news by id');
            return createSuccessResponse(news, 'Get news by id');
        } catch {
            return createBadRequset('Get news by id');
        }
    }

    async createNews(
        owner: User,
        createNews: CreateNewsDTO,
        file: Express.Multer.File
    ): Promise<Http> {
        try {
            const topics = await this.topicService.getTopics();

            const image = await this.imageService.uploadImage(
                file,
                createNews.title
            );

            const ownerInfo = {
                uuid: owner.uuid,
                fullname: owner.fullname,
                avatar: owner.avatar,
            };

            if (!image) return createBadRequset('Upload image');

            if (!topics) return createBadRequsetNoMess('Topic is not exit');

            const news = new News({
                ...createNews,
                owner: ownerInfo,
                image: image,
            });
            news.topics = getRandomSubset(topics, 3);
            const reponse = await this.newsRepository.save(news);
            if (!reponse) return createBadRequset('create news');
            return createSuccessResponse(reponse, 'Create news successfully');
        } catch {
            return createBadRequset('Create news');
        }
    }

    async updateNews(uuid: string, updateNews: UpdateNewsDTO): Promise<Http> {
        try {
            const uuidNews = updateNews.uuid;

            const news = await this.newsRepository
                .createQueryBuilder('news')
                .where('news.uuid = :uuidNews', { uuidNews })
                .leftJoinAndSelect('news.owner', 'owner')
                .andWhere('owner.uuid = :uuid', { uuid })
                .getOne();

            if (!news) return createBadRequset('Update news');
            const response = await this.newsRepository.update(
                { uuid: updateNews.uuid },
                updateNews
            );
            if (!response) return createBadRequset('Update news');

            return createSuccessResponse(response, 'Update news successfully');
        } catch (error) {
            return createBadRequset(error.message);
        }
    }

    async deleteNews(userUuid: string, uuid: UuidDTO): Promise<any> {
        const news = await this.newsRepository
            .createQueryBuilder('news')
            .leftJoinAndSelect('news.owner', 'owner')
            .where('news.uuid = :uuid', { uuid })
            .andWhere('owner.uuid = :uuid', { uuid })
            .getOne();
        if (!news) return createBadRequset('Delete news');
        const response = await this.newsRepository.remove(news);
        if (!response) return createBadRequset('Delete news');
        return createSuccessResponse(
            'Delete news successfully',
            'Delete news successfully'
        );
    }

    async getRandomSubset(array: Object[], count: number) {
        const shuffledArray = array.slice(); // Tạo một bản sao của mảng để không ảnh hưởng đến mảng gốc
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
                shuffledArray[j],
                shuffledArray[i],
            ];
        }
        return shuffledArray.slice(0, count);
    }

    async createDummyNEews(user: User): Promise<any> {
        const dummyNews = [];
        const topics = await this.topicService.getTopics();

        for (let i = 0; i < 10; i++) {
            const image = await this.imageService.createDummyImage();
            const news = new News({
                image: image,
                title: fakerVI.lorem.sentence(),
                body: fakerVI.lorem.paragraphs(),
                owner: user,
            });
            news.topics = getRandomSubset(topics, 3);

            dummyNews.push(news);
        }

        const response = await this.newsRepository.save(dummyNews);

        return createSuccessResponse(
            `${response.length} was created`,
            'Create dummy news'
        );
    }

    async responseOfNews(news: News[]): Promise<News[]> {
        const imageUrl = news.map((news) => news.image.url);
        const imageUuid = news.map((news) => news.image.uuid);

        const ownerFullname = news.map((news) => news.owner);
        const ownerAvatar = news.map((news) => news.owner.avatar.url);

        const topics: any = news.map((news) =>
            news.topics.map((topic) => topic.name)
        );

        imageUrl.forEach((imageUrl, index) => {
            news[index].image = {
                uuid: imageUuid[index],
                url: imageUrl,
            };
            news[index].owner = {
                fullname: ownerFullname[index].fullname,
                avatar: {
                    url: ownerAvatar[index],
                },
            };
            news[index].topics = topics[index];
        });
        return news;
    }

    async getAllNewsByTopicName(): Promise<any> {
        // const news = await this.newsRepository
        //     .createQueryBuilder('news')
        //     .leftJoinAndSelect('news.topics', 'topics')
        //     .where('topics.name like :name', {
        //         name: 'warvip3215431',
        //     })
        //     .getMany();
        // console.log(news);
        // return news;

        const topic = await this.topicRepository.find({
            relations: {
                news: true,
            },
        });
        return topic;
    }
}
