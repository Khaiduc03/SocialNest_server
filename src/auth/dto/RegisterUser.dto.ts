import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO {
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
    username: string;
}
