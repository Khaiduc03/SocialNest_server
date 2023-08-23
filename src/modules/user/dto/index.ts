import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import e from 'express';
import { Gender } from 'src/entities';

export class GetUserDTO {
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
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @IsEnum(Gender)
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    @Expose()
    dob: string;
}
