import { Expose, plainToClass } from 'class-transformer';
import { uuids4 } from 'src/utils';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany
} from 'typeorm';
import { Base } from './base';
import { News } from './news.entity';
import { User } from './user.entity';

@Entity({
    name: Topic.name.toLowerCase(),
    orderBy: {
        uuid: 'ASC',
    },
})
export class Topic extends Base {
    @Expose()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @ManyToMany(() => News, (news) => news.topics)
    @JoinTable({
        name: 'news_topic_relation',
        joinColumn: { name: 'topic_uuid', referencedColumnName: 'uuid' },
        inverseJoinColumn: { name: 'news_uuid', referencedColumnName: 'uuid' },
    })
    news: News[];

    constructor(topic: Partial<Topic>) {
        super(); // call constructor of BaseEntity
        if (topic) {
            Object.assign(
                this,
                plainToClass(User, topic, { excludeExtraneousValues: true })
            );
            this.uuid = topic.uuid || uuids4();
        }
    }
}
