import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    refreshToken: string;
}
