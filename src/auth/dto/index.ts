import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export * from './LoginUser.dto';
export * from './RefreshToken.dto';
export * from './RegisterAdmin.dto';
export * from './RegisterUser.dto';

export class UpdatePasswordDTO {
    @Expose()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    password: string;
}

export class ChangePasswordDTO {
    @Expose()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    oldPassword: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    newPassword: string;
}
