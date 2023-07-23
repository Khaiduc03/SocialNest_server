import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/core';
import { Http, createSuccessResponse } from 'src/common';
import { createImage, uuidImage } from './dto';
import { Image } from 'src/entities';

@Controller('image')
// @UseGuards(AuthGuard)
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get()
    async getImages(): Promise<Http> {
        return await this.imageService.getImages();
    }

    @Get(':uuid')
    async getImage(@Param('uuid') uuid: string): Promise<Http> {
        return await this.imageService.getImage(uuid);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createImage(
        @UploadedFile() images: Express.Multer.File
    ): Promise<Http> {
        const response = await this.imageService.uploadImage(images, 'test');
        return createSuccessResponse(response, 'Create image');
    }

    @Post('multiple')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image1', maxCount: 2 },
            { name: 'image2', maxCount: 1 },
        ])
    )
    async uploadMultipleImages(
        @UploadedFiles() files
    ): Promise<any> {
        console.log(files);
        // const response = await this.imageService.uploadMultipleImages(images, 'test');
        //return createSuccessResponse(response, 'Create image');
    }

    @Delete()
    async deleteImage(@Body() uuid: uuidImage): Promise<Http> {
        return await this.imageService.deleteImage(uuid.uuid);
    }
}
