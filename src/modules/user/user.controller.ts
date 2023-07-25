import {
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Http } from 'src/common';
import { AuthGuard } from 'src/core';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getUserBy(@Query('uuid') uuid: string): Promise<Http> {
        return await this.userService.getUserById(uuid);
    }

    @Get('profile')
    async getProfileUser(@Req() req: Request): Promise<Http> {
        const { uuid } = req['user'];

        return await this.userService.getProfileUser(uuid);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async getAvatar(
        @Req() req: Request,
        @UploadedFile() avatar: Express.Multer.File
    ): Promise<Http> {
        const { uuid } = req['user'];
        return await this.userService.updateAvatar(uuid, avatar);
    }

    @Delete('avatar')
    async deleteAvatar(@Req() body: Request): Promise<Http> {
        const { uuid } = body['user'];

        return await this.userService.deleteAvatar(uuid);
    }
}
