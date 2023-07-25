import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { CloudService } from '../cloud';
import { Http, createBadRequset, createSuccessResponse } from 'src/common';
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

    //delete image
    async deleteImage(uuid: string): Promise<Http> {
        if (!uuid) return createBadRequset('delete image');
        // console.log(uuid);
        const image = await this.imageRepository

            .createQueryBuilder('image')
            .where('image.uuid = :uuid', { uuid })
            .getOne();

           

        if (!image.public_id) return createBadRequset('delete image');

        const deleteImage = await this.deleteImageFromCloud(image.public_id);
      console.log(deleteImage);
         await this.imageRepository.softRemove(image);
        // console.log(reponse);
        
    }

    // async deleteImage(uuid: string): Promise<Http> {
    //     try {
    //         if (!uuid) return createBadRequset('delete image');

    //         const image = await this.imageRepository
    //             .createQueryBuilder('image')
    //             .where('image.uuid = :uuid', { uuid })
    //             .getOne();

    //             console.log(image);

    //         //if (!image) return createBadRequset('delete image');
    //        //const deleteImage = await this.deleteImageFromCloud(image.public_id);
    //        // console.log( "=>>>>>>>>>>>",deleteImage );
    //        //how to set image to null

    //         const reponse = await this.imageRepository.remove(image);
    //         return createSuccessResponse(
    //             `image delete at time: ${reponse.deletedAt}`,
    //             'Delete image'
    //         );
    //     } catch (error) {
    //         throw createBadRequset(`${error}`);
    //     }
    // }
}
