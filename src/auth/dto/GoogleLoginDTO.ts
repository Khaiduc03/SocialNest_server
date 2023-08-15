// google-login.dto.ts
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDTO {
    @IsNotEmpty()
    @Expose()
    @IsString()
    idToken: string;

    @IsString()
    @Expose()
    @IsNotEmpty()
    device_token: string;
}
