import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateTopicDTO {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class DeleteTopicDTO {
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
