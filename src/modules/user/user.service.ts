import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { Http, createBadRequset, createSuccessResponse } from 'src/common';
import { ImageService } from '../image';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly imageService: ImageService
    ) {}

    //get profile user
    async getProfileUser(uuid: string): Promise<Http> {
        const profile = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.avatar', 'avatar')
            .where('user.uuid = :uuid', { uuid })
            .getOne();

        if (!profile) return createBadRequset('Get profile user');
        return createSuccessResponse(profile, 'Get profile user');
    }

    // get user by
    async getUserById(uuid: string): Promise<Http> {
        const user = await this.userRepository
            .createQueryBuilder(User.name.toLocaleLowerCase())
            .where('user.uuid = :uuid', { uuid })
            .leftJoinAndSelect('user.avatar', 'avatar')
            .getOne();
        if (!user) return createBadRequset('Get user by uuid');
        return createSuccessResponse(user, 'Get user by uuid');
    }

    // get users
    

    // update profile
    

    // update avatar
    async updateAvatar(
        uuid: string,
        avatar: Express.Multer.File
    ): Promise<Http> {
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .getOne();
        if (!isExist) return createBadRequset('Update avatar');

        const uploaded = await this.imageService.uploadImage(
            avatar,
            isExist.username
        );
        if (!uploaded) return createBadRequset('Update avatar');
        isExist.avatar = uploaded;
        const response = await this.userRepository.save(isExist);
        if (!response) return createBadRequset('Update avatar');
        return createSuccessResponse(response, 'Update avatar');
    }

    // delete avatar
    async deleteAvatar(uuid: string): Promise<Http> {
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .leftJoinAndSelect('user.avatar', 'avatar')
            .getOne()
        if (!isExist.avatar) return createBadRequset('Delete avatar');
        console.log(isExist);
        const deleted = await this.imageService.deleteImage(isExist.avatar.uuid);
        if (!deleted) return createBadRequset('Delete avatar');
        isExist.avatar = null;
        const response = await this.userRepository.save(isExist);
        if (!response) return createBadRequset('Delete avatar');
        return createSuccessResponse(response, 'Delete avatar');
    }

    
}
