import { Body, Controller, Get, HttpExceptionBody, HttpExceptionBodyMessage, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginUserDto } from './dto';
import { Roles, UserRole } from 'src/core/guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    //login
    // @Post('login')
    // async login(@Body() loginDTO:LoginUserDto ) {
        
    //     return await this.authService.login(loginDTO);
    // }
    //register
    @Post('register')
    async register(@Body() registerDTO:RegisterUserDTO): Promise<any> {
        return await this.authService.register(registerDTO);
    }

    @Get('test')
    @Roles(UserRole.ADMIN)
    async test(): Promise<any> {
        return 'Thanh cong';
    }

}
