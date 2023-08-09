import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNewsDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    body: string;

    @IsNotEmpty()
    topic: string[];
}

export class UpdateNewsDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    image: string;
}
