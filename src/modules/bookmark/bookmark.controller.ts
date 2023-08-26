import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { Http, createSuccessResponse } from 'src/common';
import { AuthGuard } from 'src/core';
import { Request } from 'express';

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
        const  user  = req['user'];
      
        const bookmarks = await this.bookmarkService.createDummyBookmark(user);

        return createSuccessResponse(bookmarks, 'Create dummy bookmark');
    }
}
