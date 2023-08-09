import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
} from 'src/common';
import { Topic } from 'src/entities';
import { In, Repository } from 'typeorm';
import { CreateTopicDTO, DeleteTopicDTO, UpdateTopicDTO } from './dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>
    ) {}

    // get all topic
    async getAllTopic(): Promise<Http> {
        const response = await this.topicRepository.find();
        if (!response) return createBadRequset('Get all topic is fail!!');
        if (response.length === 0)
            return createBadRequsetNoMess('No topic found!!');

        return createSuccessResponse(response, 'Get all topic');
    }

    async getTopicById(uuid: string): Promise<Topic> {
      const response = await this.topicRepository
        .findOne({
          where: { uuid: uuid + '' },
        })
        .catch((err) => {});
  
      if (!response) return null;
  
      return response;
    }

    // get topic by id
    async getTopicsByIds(uuids: string[]): Promise<Topic[]> {
        const topics = await this.topicRepository.find({
            where: { uuid: In(uuids) },
        });

        if (!topics || topics.length === 0) return null;

        return topics;
    }

    // create topic
    async createTopic(topic: CreateTopicDTO): Promise<Http> {
        const isExit = await this.topicRepository.findOne({
            where: { name: topic.name },
        });
        if (isExit) return createBadRequsetNoMess('Topic is exit!!');
        const response = await this.topicRepository.save(topic);
        if (!response) return createBadRequset('Create topic is fail!!');

        return createSuccessResponse(response, 'Create topic');
    }

    // update topic by id
    async updateTopicById(updateTopicDTO: UpdateTopicDTO): Promise<Http> {
        const response = await this.topicRepository
            .update({ uuid: updateTopicDTO.uuid }, updateTopicDTO)
            .catch((err) => {});
        if (!response) return createBadRequset('Update topic is fail!!');

        return createSuccessResponse(response, 'Update topic');
    }

    // delete topic by id
    async deleteTopicById(deleteTopicDTO: DeleteTopicDTO): Promise<Http> {
        const isExits = await this.topicRepository
            .findOne({
                where: { uuid: deleteTopicDTO.uuid + '' },
            })
            .catch((err) => {});
        if (!isExits) return createBadRequsetNoMess('Topic is not exits!!');
        await this.topicRepository
            .delete({ uuid: deleteTopicDTO.uuid + '' })
            .catch((err) => {});

        return createSuccessResponse(isExits, 'Delete topic');
    }
}
