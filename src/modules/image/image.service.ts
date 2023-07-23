import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { CloudService } from '../cloud';
import { Http, createBadRequset, createSuccessResponse } from 'src/common';
import { createImage } from './dto';
@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private readonly cloud: CloudService
    ) {}

    async uploadImageToCloud(
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const response = await this.cloud.uploadFileImage(file, folder);
        return response;
    }

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
    
        for (const file of files) {
            const uploaded = await this.uploadImageToCloud(file, folder);
            if (uploaded) {
                const image = new Image({
                    public_id: uploaded.public_id,
                    url: uploaded.url,
                    secure_url: uploaded.secure_url,
                });
                uploadedImages.push(image);
            }
        }
    
        const response = await this.imageRepository.save(uploadedImages);
        return response;
    }

    async createImage(
        file: Express.Multer.File,
        folder: string
    ): Promise<Http> {
        const uploaded = await this.uploadImageToCloud(file, folder);
        if (!uploaded) return createBadRequset('Create image');

        const { url, public_id, secure_url } = uploaded;

        const imageEntity = new Image({
            url,
            public_id,
            secure_url,
        });

        imageEntity.url = url;
        imageEntity.public_id = public_id;
        imageEntity.secure_url = secure_url;

        const response = await this.imageRepository.save(imageEntity);
        if (!response) return createBadRequset('Create image');

        return createSuccessResponse(response, 'Create image');
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

    async deleteImage(uuid: string): Promise<Http> {
        try {
            if (!uuid) return createBadRequset('delete image');

            const image = await this.imageRepository
                .findOneByOrFail({
                    uuid: uuid,
                })
                .catch();
            if (!image) return createBadRequset('delete image');

            const reponse = await this.imageRepository.remove(image);
            return createSuccessResponse(
                `image delete at time: ${reponse.deletedAt}`,
                'Delete image'
            );
        } catch (error) {
            throw createBadRequset(`${error}`);
        }
    }
}
