import { UploadedFile } from '@nestjs/common';
import { Expose } from 'class-transformer';
import {  IsNotEmpty, IsString, } from 'class-validator';

export class uuidImage {
  @Expose()
  //@IsUUID()
  @IsString()
  @IsNotEmpty()
  uuid:string
}

export class createImage{
  @Expose()

  
  file: Express.Multer.File;

  @Expose()
  @IsNotEmpty()
  @IsString()
  folder:string
}