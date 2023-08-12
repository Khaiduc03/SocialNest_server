// google-login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDTO {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
