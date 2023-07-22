import { uuids4 } from 'src/utils';
import { Base } from './base';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { newsStatus } from './types';
import { Image } from './image.entity';
import { User } from './user.entity';
import { Topic } from './topic.entity';

@Entity({
    name: 'news',
    orderBy: {
        uuid: 'ASC',
    },
})
export class News extends Base {
    @Expose()
    @Column({ type: 'varchar', length: 300, nullable: false })
    title: string;

    @Expose()
    @Column({ type: 'varchar', length: 300, nullable: false })
    body: string;

    @Expose()
    @Column({ type: 'enum', enum: newsStatus, default: newsStatus.Public })
    status: newsStatus;

    @Expose()
    @OneToMany(() => Image, (image) => image.uuid)
    @JoinColumn()
    images: Image[];

    @Expose()
    @ManyToOne(() => User, (user) => user.uuid)
    user_uuid: User;

    @Expose()
    @OneToMany(() => Topic, (topic) => topic.uuid)
    @JoinColumn()
    topic: Topic;

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
