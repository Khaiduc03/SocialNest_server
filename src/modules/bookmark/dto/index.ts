import { IsNotEmpty, IsString } from 'class-validator';

export class UuidOfUserDTO {
    @IsNotEmpty()
    @IsString()
    user_uuid: string;
}
