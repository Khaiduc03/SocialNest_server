import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Expose()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;

    @IsString()
    @Expose()
    @IsNotEmpty()
    deviceToken: string;

    constructor(deviceToken = '312423432') {}
}
