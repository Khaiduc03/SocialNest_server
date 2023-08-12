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
import { CreateNewsDTO } from './dto';
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
                .getOne();
            
            if (!news) return createBadRequset('Get news all');
    
            // Trích xuất thông tin public_id và uuid của image
            const imagePublicId = news.image.public_id;
            const imageUuid = news.image.uuid;
    
            // Trích xuất thông tin public_id và uuid của avatar
            const avatarPublicId = news.owner.avatar.public_id;
            const avatarUuid = news.owner.avatar.uuid;
    
            const ownerFullname = news.owner.fullname;
            const ownerAvatar = news.owner.avatar;

            // Tạo các đối tượng chứa thông tin cần lấy
            const imageInfo = {
                public_id: imagePublicId,
                uuid: imageUuid,
            };
    
            const avatarInfo = {
                public_id: avatarPublicId,
                uuid: avatarUuid,
            };

            const ownerInfo = {
                uuid: news.owner.uuid,
                fullname: ownerFullname,
                avatar: ownerAvatar,
                
            };
    
            // Gán thông tin vào news
            news.owner = ownerInfo;
    
            // Gán thông tin vào news và owner
            news.image = imageInfo;
            news.owner.avatar = avatarInfo;
    
            return createSuccessResponse(news, 'Get news all');
        } catch {
            return createBadRequset('Get news all');
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
            // console.log(owner);

            const topics = await this.topicService.getTopicsByIds(
                createNews.topic
            );
            const topicNames = topics.map((topic) => topic.name);
            console.log(topicNames);

            // console.log(topic)
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

    


}
