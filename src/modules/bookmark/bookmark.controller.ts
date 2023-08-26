import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { Http, createBadRequset, createSuccessResponse } from 'src/common';
import { AuthGuard } from 'src/core';
import { Request } from 'express';
import { CreateBookmarkDTO } from './dto';

@Controller('bookmark')
@UseGuards(AuthGuard)
export class BookmarkController {
    constructor(private readonly bookmarkService: BookmarkService) {}

    //crud bookmark
    //get all bookmark of user

    @Get()
    async getAllBookmarkOfUser(@Req() req: Request): Promise<any> {
        const user = req['user'];

        const bookmarks = await this.bookmarkService.getAllBookmarkOfUser(
            user.uuid
        );

        return createSuccessResponse(bookmarks, 'Get all bookmark of user');
    }

    @Get('create-dummy-bookmark')
    async createDummyBookmark(@Req() req: Request): Promise<any> {
        const user = req['user'];

        const bookmarks = await this.bookmarkService.createDummyBookmark(user);

        return createSuccessResponse(
            `${bookmarks.length} was created`,
            'Create dummy bookmark'
        );
    }

    @Post()
    async createBookmark(
        @Req() req: Request,
        @Body() createBookmarkDTO: CreateBookmarkDTO
    ): Promise<any> {
        try {
            const user = req['user'];

            const bookmarks = await this.bookmarkService.createBookMark(
                createBookmarkDTO,
                user
            );
            if (!bookmarks) return createBadRequset('Create dummy bookmark');

            return createSuccessResponse(bookmarks, 'Create dummy bookmark');
        } catch (error) {
            console.log(
                'Have something wrong when create bookmark at bookmark.controller.ts: ' +
                    error.message
            );
        }
    }
}
