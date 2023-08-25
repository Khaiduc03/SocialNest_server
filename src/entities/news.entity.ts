import { uuids4 } from 'src/utils';
import { Base } from './base';
import { Expose, plainToClass } from 'class-transformer';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { newsStatus } from './types';

import { User } from './user.entity';
import { Topic } from './topic.entity';
import { Image } from './image.entity';

@Entity({
    name: News.name.toLowerCase(),
    orderBy: {
        uuid: 'ASC',
    },
})
export class News extends Base {
    @Expose()
    @Column({ type: 'varchar', length: 300, nullable: false })
    title: string;

    @Expose()
    @Column({ type: 'text', nullable: true })
    body: string;

    @Expose()
    @Column({ type: 'enum', enum: newsStatus, default: newsStatus.Public })
    status: newsStatus;

    @Expose()
    @OneToOne(() => Image, (image) => image.uuid)
    @JoinColumn({ name: 'image_uuid', referencedColumnName: 'uuid' })
    image: Partial<Image>;

    @Expose()
    @ManyToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'owner', referencedColumnName: 'uuid' })
    owner: Partial<User>;

    @ManyToMany(() => Topic)
    @JoinTable({
        name: 'news_topic_relation',
        joinColumn: { name: 'news_uuid', referencedColumnName: 'uuid' },
        inverseJoinColumn: { name: 'topic_uuid', referencedColumnName: 'uuid' },
    })
    topics: Partial<Topic[]>;

    constructor(news: Partial<News>) {
        super(); // call constructor of BaseEntity
        if (news) {
            Object.assign(
                this,
                plainToClass(News, news, { excludeExtraneousValues: true })
            );
            this.uuid = news.uuid || uuids4();
        }
    }
}
