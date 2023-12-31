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
import { Http, createBadRequset, createSuccessResponse } from 'src/common';
import { AuthGuard } from 'src/core';
import { CreateNewsDTO, PageDTO, UpdateNewsDTO, UuidDTO } from './dto';
import { NewsService } from './news.service';

@Controller('news')
@UseGuards(AuthGuard)
export class NewsController {
    constructor(private newsService: NewsService) {}

    //crud news
    @Get()
    async getAllNews(@Body() pageDTO: PageDTO): Promise<Http> {
        return await this.newsService.getAllNewsWithPage(pageDTO);
    }

    @Get('/id:uuid')
    async getNewsById(@Param('uuid') uuid: string): Promise<Http> {
        const response = await this.newsService.getNewsById(uuid);
        if (!response) return createBadRequset('Get news by id');
        return createSuccessResponse(response, 'Get news by id');
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

    @Get('test')
    async getAllNewsByTopicName(): // @Param('topicName') topicName: string
    Promise<any> {}

    @Get('dummy-news')
    async dummyNews(@Req() req: Request): Promise<any> {
        const user = req['user'];
        console.log(user);
        // return await this.newsService.createDummyNEews(user);
    }
}
