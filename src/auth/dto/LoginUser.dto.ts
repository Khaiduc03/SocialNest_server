import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;

    @IsString()
    @Expose()
    @IsNotEmpty()
    device_token: string;

  
}
