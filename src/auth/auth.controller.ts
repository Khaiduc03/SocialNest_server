import { Body, Controller, Get, Post } from '@nestjs/common';
import { Http } from 'src/common';
import { AuthService } from './auth.service';
import {
    LoginUserDto,
    RefreshTokenDto,
    RegisterUserDTO,
    UpdatePasswordDTO,
} from './dto';
import { GoogleLoginDTO } from './dto/GoogleLoginDTO';
import { RegisterAdminDTO } from './dto/RegisterAdmin.dto';
import { ChangePasswordDTO } from './dto/index';
// import { Roles, RolesGuard } from 'src/core/guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDTO: RegisterUserDTO): Promise<Http> {
        return await this.authService.register(registerDTO);
    }

    @Post('login')
    async login(@Body() loginDTO: LoginUserDto): Promise<Object> {
        return await this.authService.login(loginDTO);
    }

    @Post('admin')
    async registerAdmin(@Body() registerDTO: RegisterAdminDTO): Promise<Http> {
        return await this.authService.registerAdmin(registerDTO);
    }

    @Post('refresh-token')
    async refreshToken(
        @Body() RefreshTokenDto: RefreshTokenDto
    ): Promise<Http> {
        return await this.authService.refreshToken(RefreshTokenDto);
    }

    @Post('google-login')
    async googleLogin(@Body() googleLoginDTO: GoogleLoginDTO): Promise<Object> {
        return this.authService.googleLogin(googleLoginDTO);
    }

    @Post('update-password')
    async updatePassword(
        @Body() UpdatePasswordDTO: UpdatePasswordDTO
    ): Promise<Http> {
        return await this.authService.updatePassword(UpdatePasswordDTO);
    }

    @Post('change-password')
    async changePassword(
        @Body() ChangePasswordDTO: ChangePasswordDTO
    ): Promise<Http> {
        return await this.authService.changePassword(ChangePasswordDTO);
    }

    @Get('dummy-user')
    async dummyUser(): Promise<Http> {
        return await this.authService.crateDummyUser();
    }
}
