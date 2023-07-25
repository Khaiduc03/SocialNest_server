import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/entities';

export class RegisterAdminDTO {
    // @IsString()
    // @IsNotEmpty()
    // @IsEmail()
    // @Expose()
    // email: string;

    @IsString()
    @Expose()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;
}
