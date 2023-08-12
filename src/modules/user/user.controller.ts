import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
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
import { GetUserDTO, UpdateProfileDTO } from './dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getAllUsers(): Promise<Http> {
        return await this.userService.getAllUsers();
    }

    @Get('profile')
    async getProfileUser(@Req() req: Request): Promise<Http> {
        const { uuid } = req.body.user;
         console.log(uuid)

        return await this.userService.getProfileUser(uuid);
    }

    @Get(':uuid')
    async getUserById(@Param('uuid') uuid: string): Promise<Http> {
        return await this.userService.getUserById(uuid);
    }

    //update profile
    @Post('profile')
    async updateProfile(
        @Req() req: Request,
        @Body() updateProfile: UpdateProfileDTO
    ): Promise<Http> {
        const { uuid } = req.body.user;
        return await this.userService.updateProfile(updateProfile, uuid);
    }

    @Put('avatar')
    @UseInterceptors(FileInterceptor('user'))
    async getAvatar(
        @Req() req: Request,
        @UploadedFile() avatar: Express.Multer.File
    ): Promise<any> {
        console.log(req)
        // const { uuid } = req['user'];
        // console.log(uuid)
        //return await this.userService.updateAvatar(uuid, avatar);
    }

    @Delete('avatar')
    async deleteAvatar(@Req() req: Request): Promise<Http> {
        const { uuid } = req.body.user;

        return await this.userService.deleteAvatar(uuid);
    }

    @Delete()
    async deleteUser(@Body() user: GetUserDTO): Promise<Http> {
        return await this.userService.deleteUser(user);
    }
}
