import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Http, createBadRequset, createSuccessResponse } from 'src/common';
import { AuthGuard } from 'src/core';
import { CreateTopicDTO, DeleteTopicDTO, UpdateTopicDTO } from './dto';
import { TopicService } from './topic.service';

@Controller('topic')
@UseGuards(AuthGuard)
export class TopicController {
    constructor(private topicService: TopicService) {}

    //get all topic
    @Get()
    async getAllTopic(): Promise<Http> {
        return this.topicService.getAllTopic();
    }

    //get topic by id
    @Get(':uuid')
    async getTopicById(@Param('uuid') uuid: string): Promise<Http> {
        const response = await this.topicService.getTopicById(uuid);
        if (!response) return createBadRequset('Get topic by id is fail!!');
        return createSuccessResponse(response, 'Get topic by id');
    }

    //create topic
    @Post()
    async createTopic(@Body() createTopicDTO: CreateTopicDTO): Promise<Http> {
        return this.topicService.createTopic(createTopicDTO);
    }

    //update topic by id
    @Put('update')
    async updateTopicById(
        @Body() UpdateTopicDTO: UpdateTopicDTO
    ): Promise<Http> {
        return this.topicService.updateTopicById(UpdateTopicDTO);
    }

    //delet topic by id
    @Delete('delete')
    async deleteTopicById(
        @Body() deleteTopicDTO: DeleteTopicDTO
    ): Promise<Http> {
        return this.topicService.deleteTopicById(deleteTopicDTO);
    }
}
