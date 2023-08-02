import { createImage } from './dto/index';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { CloudService } from '../cloud';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';
@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private readonly cloud: CloudService
    ) {}
    /////////////////////////////// cloudinary ///////////////////////////////
    async uploadImageToCloud(
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const response = await this.cloud.uploadFileImage(file, folder);
        return response;
    }

    async uploadMutipleImageToCloud(
        file: Express.Multer.File[],
        folder: string
    ): Promise<any> {
        const response = await this.cloud.uploadMultipleImages(file, folder);
        return response;
    }

    async deleteImageFromCloud(
        publicId: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const response = await this.cloud.deleteFileImage(publicId);
        return response;
    }

    async uploadAvatarToCloud(
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const response = await this.cloud.uploadFileAvatar(file, folder);
        return response;
    }

    //////////////////////////// image ////////////////////////////
    async uploadImage(
        file: Express.Multer.File,
        folder: string
    ): Promise<Image | undefined> {
        const uploaded = await this.uploadImageToCloud(file, folder);
        if (!uploaded) return undefined;
        const image = new Image({
            public_id: uploaded.public_id,
            url: uploaded.url,
            secure_url: uploaded.secure_url,
        });

        const response = await this.imageRepository.save(image);
        return response;
    }

    async uploadMultipleImages(
        files: Express.Multer.File[],
        folder: string
    ): Promise<Image[]> {
        const uploadedImages: Image[] = [];

        //How to get leght of array in for loop

        const uploaded = await this.uploadMutipleImageToCloud(files, folder);

        for (const file of files) {
            if (uploaded) {
                const image = new Image({
                    public_id: uploaded.public_id,
                    url: uploaded.url,
                    secure_url: uploaded.secure_url,
                });
                uploadedImages.push(image);
            }
        }

        const response = await this.imageRepository.save(uploaded);
        return response;
    }

    async getImages(): Promise<Http> {
        const response = await this.imageRepository.find();
        return createSuccessResponse(response, 'Get images');
    }

    async getImage(uuid: string): Promise<Http> {
        const image = await this.imageRepository.findOneByOrFail({
            uuid: uuid,
        });
        if (!image) return createBadRequset('get image');

        return createSuccessResponse(image, 'Get images');
    }

    /*
     * 1. get image from database
    *  2. delete image from cloud
    * 3. set image to null
    * 4. create new image
    * 5. save image to database
    * 6. return image

    */

    async createImage(): Promise<Image> {
        const image = new Image({});
        const response = await this.imageRepository.save(image);
        //console.log(response)
        return response;
    }

    async updateAvatar(
        avatar: Image,
        file: Express.Multer.File,
        folder: string
    ): Promise<any> {
        if (avatar !== null) {
            await this.deleteImageFromCloud(avatar.public_id);
        }

        const uploaded = await this.uploadAvatarToCloud(file, folder);
        if (!uploaded) return null;
        const response = await this.imageRepository.update(avatar.uuid, {
            public_id: uploaded.public_id,
            url: uploaded.url,
            secure_url: uploaded.secure_url,
        });
        return response;
        //const uploaded = await this.uploadAvatarToCloud(file, folder);

        // await this.deleteImageFromCloud(avatar.public_id);
        // const uploaded = await this.uploadAvatarToCloud(file, folder);
        // const response = await this.imageRepository.save({
        //     public_id: uploaded.public_id,
        //     url: uploaded.url,
        //     secure_url: uploaded.secure_url,
        //     uuid: avatar.uuid,
        // });
        // console.log(response);
        // return response;
    }

    // delete image
    async deleteAvatar(avatar: Image): Promise<Http> {
        const image = await this.imageRepository.findOne({
            where: { uuid: avatar.uuid },
        });
        if (!image) return createBadRequsetNoMess('Image not found');
        await this.deleteImageFromCloud(image.public_id).catch((error) => {
            return createBadRequsetNoMess(error);
        });
        await this.imageRepository.update(image.uuid, {
            public_id: null,
            url: null,
            secure_url: null,
        });
        return createSuccessResponse(image, 'Delete image');
    }
}
