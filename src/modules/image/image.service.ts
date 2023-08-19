import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';

import { Repository } from 'typeorm';
import { CloudService } from '../cloud';
import { faker, fakerVI } from '@faker-js/faker';
import { Image } from 'src/entities';
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
        if (!response) return undefined;
        return response;
    }

    async uploadMutipleImageToCloud(
        files: Express.Multer.File[],
        folder: string
    ): Promise<UploadApiErrorResponse | UploadApiResponse[]> {
        const filesArray = Object.values(files).flat();
        const uploaded = await this.cloud.uploadMultipleFiles(
            filesArray,
            folder
        );
        return uploaded;
    }

    async uploadMultipleImages(
        files: Express.Multer.File[],
        folder: string
    ): Promise<Image[]> {
        const uploadedImages: Image[] = [];
        const uploadedResults = await this.uploadMutipleImageToCloud(
            files,
            folder
        );
        for (let i = 0; i < uploadedResults.length; i++) {
            const uploadedResult = uploadedResults[i];
            const image = new Image({
                public_id: uploadedResult.public_id,
                url: uploadedResult.url,
                secure_url: uploadedResult.secure_url,
            });
            uploadedImages.push(image);
        }
        await this.imageRepository.save(uploadedImages);
        console.log(uploadedImages);
        return uploadedImages;
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

    async createImage(url?: string): Promise<Image> {
        console.log(url);
        const image = new Image({
            public_id: url,
            url: url,
            secure_url: url,
        });
        const response = await this.imageRepository.save(image);
        return response;
    }

    async createDummyImage(): Promise<Image | undefined> {
        const image = new Image({
            public_id: fakerVI.image.avatar(),
            url: fakerVI.image.avatar(),
            secure_url: fakerVI.image.avatar(),
        });
        return await this.imageRepository.save(image);
    }

    async updateAvatar(
        avatar: Partial<Image>,
        file: Express.Multer.File,
        folder: string
    ): Promise<any> {
        if (avatar !== null) {
            await this.deleteImageFromCloud(avatar.public_id);
        }

        const uploaded = await this.uploadAvatarToCloud(file, folder);
        if (!uploaded) return null;
        // const response = await this.imageRepository.update(avatar.uuid, {
        //     public_id: uploaded.public_id,
        //     url: uploaded.url,
        //     secure_url: uploaded.secure_url,
        // });
        // console.log(response)
        avatar.public_id = uploaded.public_id;
        avatar.url = uploaded.url;
        avatar.secure_url = uploaded.secure_url;
        const response = await this.imageRepository.save(avatar);
        console.log(response);

        return response;
    }

    // delete image
    async deleteAvatar(avatar: Partial<Image>): Promise<Http> {
        const image = await this.imageRepository.findOne({
            where: { uuid: avatar.uuid },
        });
        if (!image) return createBadRequsetNoMess('Image not found');
        if (image.public_id === null)
            return createBadRequsetNoMess('Image is null');
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
