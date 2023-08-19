import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { ImageService } from '../image';
import { GetUserDTO, UpdateProfileDTO } from './dto';

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
            .innerJoinAndSelect('user.avatar', 'avatar')
            .where('user.uuid = :uuid', { uuid })
            .getOne();

        if (!profile) return createBadRequset('Get profile user');
        const { password, ...profileWithoutPassword } = profile;
        return createSuccessResponse(
            profileWithoutPassword,
            'Get profile user'
        );
    }

    // get user by
    async getUserById(uuid: string): Promise<Http> {
        try {
            const user = await this.userRepository
                .createQueryBuilder(User.name.toLowerCase())
                .where('user.uuid = :uuid', { uuid })
                .leftJoinAndSelect('user.avatar', 'avatar')
                .getOne();

            if (!user) {
                return createBadRequsetNoMess('User not found');
            }

            return createSuccessResponse(user, 'User retrieved successfully');
        } catch (error) {
            return createBadRequsetNoMess('User not found');
        }
    }

    async getUserByuuiId(uuid: string): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder(User.name.toLowerCase())
                .where('user.uuid = :uuid', { uuid })
                .leftJoinAndSelect('user.avatar', 'avatar')
                .getOne();

            if (!user) {
                return undefined;
            }

            return user;
        } catch (error) {
            return undefined;
        }
    }

    // get users
    async getAllUsers(): Promise<Http> {
        const users = await this.userRepository.find({
            relations: ['avatar'],
        });
        if (!users) return createBadRequset('Get users all');
        const response = users.map((user) => {
            const { password, ...profileWithoutPassword } = user;
            return {
                ...profileWithoutPassword,
            };
        });

        return createSuccessResponse(response, 'Get users all');
    }

    // update profile
    async updateProfile(
        updateProfile: UpdateProfileDTO,
        uuid: string,
        avatar: Express.Multer.File
    ): Promise<Http> {
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .leftJoinAndSelect('user.avatar', 'avatar')
            .getOne();
        if (!isExist) return createBadRequset('Update profile');

        const uploaded = await this.imageService.updateAvatar(
            isExist.avatar,
            avatar,
            isExist.email
        );

        const response = await this.userRepository.save({
            ...isExist,
            ...updateProfile,
            avatar: avatar ? uploaded : isExist.avatar,
        });
        if (!response) return createBadRequset('Update profile');
        return createSuccessResponse(response, 'Update profile');
    }

    //  update avatar
    async updateAvatar(
        uuid: string,
        avatar: Express.Multer.File
    ): Promise<Http> {
        if (!avatar) return createBadRequsetNoMess('avatar is null');
        //console.log(uuid);
        const isExist = await this.userRepository
            .createQueryBuilder('user')
            .where('user.uuid = :uuid', { uuid })
            .leftJoinAndSelect('user.avatar', 'avatar')
            .getOne();
        if (!isExist) return createBadRequsetNoMess('Update avatar not found');

        const uploaded = await this.imageService.updateAvatar(
            isExist.avatar,
            avatar,
            isExist.email
        );
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
        //console.log(deleted);
        return deleted;
    }

    // delete user by id
    async deleteUser(user: GetUserDTO): Promise<Http> {
        const isExits = await this.userRepository
            .findOneBy({
                uuid: user.uuid + '',
            })
            .catch((error) => {});

        if (!isExits) return createBadRequset('Delete user');
        const deleted = await this.userRepository.remove(isExits);
        if (!deleted) return createBadRequset('Delete user');
        return createSuccessResponse(deleted, 'Delete user');
    }
}
