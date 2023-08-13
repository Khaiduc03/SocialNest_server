import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News, User } from 'src/entities';
import { In, Repository } from 'typeorm';
import { ImageService } from '../image';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';
import { CreateNewsDTO, UpdateNewsDTO, UuidDTO } from './dto';
import { UserService } from '../user/user.service';
import { TopicService } from '../topic';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
        private readonly imageService: ImageService,
        private readonly userService: UserService,
        private readonly topicService: TopicService
    ) {}

    //crud news
    async getAllNews(): Promise<Http> {
        try {
            const news = await this.newsRepository
                .createQueryBuilder('news')
                .leftJoinAndSelect('news.image', 'image')
                .leftJoinAndSelect('news.owner', 'owner')
                .leftJoinAndSelect('owner.avatar', 'avatar')
                .getMany();

            if (!news) return createBadRequset('Get news all');

            // Trích xuất thông tin public_id và uuid của image
            const imageUrl = news.map((news) => news.image.url);
            const imageUuid = news.map((news) => news.image.uuid);

            const ownerFullname = news.map((news) => news.owner);
            const ownerAvatar = news.map((news) => news.owner.avatar.url);

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
            });
            return createSuccessResponse(news, 'Get news all');
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
            const topics = await this.topicService.getTopicsByIds(
                createNews.topic
            );
            const topicNames = topics.map((topic) => topic.name);
            console.log(topicNames);

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
                topic: topicNames,
                image: image,
            });

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
            //     .leftJoinAndSelect('news.owner', 'owner')

            //  //   .andWhere('owner.uuid = :uuid', { uuid })
            //     .getOne();
            console.log(news);

            // if (!news) return createBadRequset('Update news');
            // const response = await this.newsRepository.update(
            //     { uuid: updateNews.uuid },
            //     updateNews
            // );
            // if (!response) return createBadRequset('Update news');

            // return createSuccessResponse(response, 'Update news successfully');
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
}
