import { Body, Controller, Post } from '@nestjs/common';
import { Http } from 'src/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RefreshTokenDto, RegisterUserDTO } from './dto';
import { RegisterAdminDTO } from './dto/RegisterAdmin.dto';
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
}
