import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';
import { ImageService } from '../image';
import { GetUserDTO, UpdateProfileDTO } from './dto';
import { error } from 'console';

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

        // const profile = await this.userRepository.findOne({
        //     where: { uuid },

        // });

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
    async getAllUsers(): Promise<Http> {
        const users = await this.userRepository.find();
        if (!users) return createBadRequset('Get users');
        return createSuccessResponse(users, 'Get users');
    }

    // update profile
    async updateProfile(
        updateProfile: UpdateProfileDTO,
        uuid: string
    ): Promise<Http> {
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .getOne();
        if (!isExist) return createBadRequset('Update profile');
        const response = await this.userRepository.save({
            ...isExist,
            ...updateProfile,
        });
        if (!response) return createBadRequset('Update profile');
        return createSuccessResponse(response, 'Update profile');
    }

    //update avatar
    async updateAvatar(
        uuid: string,
        avatar: Express.Multer.File
    ): Promise<Http> {
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .leftJoinAndSelect('user.avatar', 'avatar')
            .getOne();
        if (!isExist) return createBadRequsetNoMess('Update avatar not found');

        const uploaded = await this.imageService.updateAvatar(
            isExist.avatar,
            avatar,
            isExist.username
        );

        // if (!uploaded) return createBadRequsetNoMess('here');
        // const response = await this.userRepository.save(isExist);
        // if (!response) return createBadRequset('Update avatar');
        return createSuccessResponse(uploaded, 'Update avatar');
    }

    // delete avatar
    async deleteAvatar(uuid: string): Promise<Http> {
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .leftJoinAndSelect('user.avatar', 'avatar')
            .getOne();
        if (!isExist.avatar) return createBadRequset('Delete avatar');

        const deleted = await this.imageService.deleteAvatar(isExist.avatar);

        if (!deleted) return createBadRequset('Delete avatar');
        console.log(deleted);
        return deleted;
    }

    // delete user by id
    async deleteUser(user: GetUserDTO): Promise<Http> {
        const isExits = await this.userRepository.findOneBy({
            uuid: user.uuid+'',
        }).catch((error)=>{});

        if (!isExits) return createBadRequset('Delete user');
        const deleted = await this.userRepository.remove( isExits);
        if (!deleted) return createBadRequset('Delete user');
        return createSuccessResponse(deleted, 'Delete user');
    }
}
