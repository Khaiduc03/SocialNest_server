import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Http } from 'src/common';
import { AuthGuard } from 'src/core';
import { CreateNewsDTO, UpdateNewsDTO, UuidDTO } from './dto';
import { NewsService } from './news.service';

@Controller('news')
@UseGuards(AuthGuard)
export class NewsController {
    constructor(private newsService: NewsService) {}

    //crud news
    @Get()
    async getAllNews(): Promise<Http> {
        return await this.newsService.getAllNews();
    }

    @Get(':uuid')
    async getNewsById(@Param('uuid') uuid: string): Promise<Http> {
        return await this.newsService.getNewsById(uuid);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createNews(
        @Body() createNews: CreateNewsDTO,
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File
    ): Promise<any> {
        const owner = req['user'];
        if (!owner) throw new UnauthorizedException('Not found user');
        return await this.newsService.createNews(owner, createNews, file);
    }

    @Put()
    @UseInterceptors(FileInterceptor('image'))
    async updateNews(
        @Body() updateNews: UpdateNewsDTO,
        @Req() req: Request
    ): Promise<any> {
        const user = req['user'];
        return await this.newsService.updateNews(user.uuid, updateNews);
    }

    @Delete()
    async deleteNews(@Req() req: Request, @Body() uuid: UuidDTO): Promise<any> {
        const user = req['user'];
        return await this.newsService.deleteNews(user.uuid, uuid);
    }
}
