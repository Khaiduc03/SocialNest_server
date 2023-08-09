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

  //upload multiple image
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string
  ): Promise<UploadApiResponse[] | UploadApiErrorResponse> {
    const uploadPromises: Promise<UploadApiResponse>[] = [];

    for (const file of files) {
      const uploadPromise = new Promise<UploadApiResponse>(
        (resolve, reject) => {
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
        }
      );
      uploadPromises.push(uploadPromise);
    }

    return Promise.all(uploadPromises);
  }

  async deleteFileImage(
    publicId: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await v2.api.delete_resources([publicId]);
  }

  async uploadFileAvatar(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder,
          use_filename: true,
          exif: true,
          invalidate: true,
          unique_filename: true,

          overwrite: true,

          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
