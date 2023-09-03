import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNewsDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    body: string;

}

export class UpdateNewsDTO {
    @IsNotEmpty()
    @IsUUID()
    uuid: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    body: string;
}

export class UpdateStatusNewsDTO {
    @IsNotEmpty()
    @IsUUID()
    uuid: string;

    @IsNotEmpty()
    status: string;
}

export class UuidDTO {
    @IsNotEmpty()
    @IsUUID()
    uuid: string;
}

export class PageDTO {
    @IsNotEmpty()
    page: number = 1;
}
