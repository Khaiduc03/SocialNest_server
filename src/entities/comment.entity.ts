import { Expose, plainToClass } from 'class-transformer';
import { Base } from './base';
import { uuids4 } from 'src/utils';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { News } from './news.entity';

@Entity({
    name: Comment.name.toLowerCase(),
    orderBy: {
        uuid: 'ASC',
    },
})
export class Comment extends Base {
    @Expose()
    @OneToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
    user_uuid: User;

    @Expose()
    @ManyToOne(() => News, (news) => news.uuid)
    @JoinColumn({ name: 'news_uuid', referencedColumnName: 'uuid' })
    news_uuid: News;

    @Expose()
    @Column({ type: 'text', default: '' })
    body: string;

    constructor(bookmark: Partial<Comment>) {
        super();
        if (bookmark) {
            Object.assign(
                this,
                plainToClass(Comment, bookmark, {
                    excludeExtraneousValues: true,
                })
            );
            this.uuid = bookmark.uuid || uuids4();
        }
    }
}
