import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities';

export class UuidOfUserDTO {
    @IsNotEmpty()
    @IsString()
    user_uuid: string;
}

export class CreateBookmarkDTO {
    @IsNotEmpty()
    @IsString()
    news_uuid: string;
}
