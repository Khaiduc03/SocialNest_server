import { Expose } from 'class-transformer'
import { IsEmail, IsEmpty } from 'class-validator'

export * from './LoginUser.dto'
export * from './RegisterUser.dto'
export * from './RegisterAdmin.dto'
export * from './RefreshToken.dto'

export class UpdatePasswordDTO {
    @Expose()
    @IsEmpty()
    @IsEmail()
    email: string

    @Expose()
    @IsEmpty()
    @IsEmail()
    password: string

}

export class ChangePasswordDTO {
    @Expose()
    @IsEmpty()
    @IsEmail()
    email: string

    @Expose()
    @IsEmpty()
    @IsEmail()
    oldPassword: string

    @Expose()
    @IsEmpty()
    @IsEmail()
    newPassword: string

}

