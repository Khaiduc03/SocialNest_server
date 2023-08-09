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
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/core';
import { NewsService } from './news.service';
import { Http } from 'src/common';
import { CreateNewsDTO, UpdateNewsDTO } from './dto';
import { Request } from 'express';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

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
    ): Promise<Http> {
         const owner = req['user'];
     
        //if (!owner) throw new UnauthorizedException('Not found user');
        return await this.newsService.createNews(owner,createNews, file);
    }

    // @Put(':uuid')
    // async updateNews(
    //     @Param('uuid') uuid: string,
    //     @Body() updateNews: UpdateNewsDTO
    // ): Promise<Http> {
    //     return await this.newsService.updateNews(uuid, updateNews);
    // }

    // @Delete(':uuid')
    // async deleteNews(@Param('uuid') uuid: string): Promise<Http> {
    //     return await this.newsService.deleteNews(uuid);
    // }
}
