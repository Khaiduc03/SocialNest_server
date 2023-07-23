import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudService {
    async uploadFileImage(
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                {
                    folder,
                    use_filename: true,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            toStream(file.buffer).pipe(upload);
        });
    }
    async deleteFileImage(
        publicId: string
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return await v2.uploader.destroy(publicId);
    }

    async uploadMultipleImages(
        files: Express.Multer.File[],
        folder: string
    ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
        const uploadPromises = files.map((file) => this.uploadFileImage(file, folder));
        return Promise.all(uploadPromises);
    }

    
}
