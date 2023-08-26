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
    name: Bookmark.name.toLowerCase(),
    orderBy: {
        uuid: 'ASC',
    },
})
export class Bookmark extends Base {
    @Expose()
    @ManyToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
    user_uuid: User;

    @Expose()
    @ManyToOne(() => News, (news) => news.uuid)
    @JoinColumn({ name: 'news_uuid', referencedColumnName: 'uuid' })
    news_uuid: News;

    constructor(bookmark: Partial<Bookmark>) {
        super();
        if (bookmark) {
            Object.assign(
                this,
                plainToClass(Bookmark, bookmark, {
                    excludeExtraneousValues: true,
                })
            );
            this.uuid = bookmark.uuid || uuids4();
        }
    }
}
