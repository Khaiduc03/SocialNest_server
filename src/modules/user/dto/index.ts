import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import e from 'express';

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
    phone: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    summary: string;

    @IsBoolean()
    @IsNotEmpty()
    @Expose()
    gender: boolean;
}
