import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import e from 'express';

export class  GetUserDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    uuid: string;
}

export class UpdateProfileDTO {
    
    @IsString()
    @IsNotEmpty()
    @Expose()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    phone: string;


}