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
    name: 'favorite',
    orderBy: {
        uuid: 'ASC',
    },
})
export class Favorite extends Base {
    @Expose()
    @OneToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
    user_uuid: User;

    @Expose()
    @OneToMany(() => News, (news) => news.uuid)
    @JoinColumn({ name: 'news_uuid', referencedColumnName: 'uuid' })
    news_uuid: News;

   

    constructor(favorite: Partial<Favorite>) {
        super();
        if (favorite) {
            Object.assign(
                this,
                plainToClass(Favorite, favorite, {
                    excludeExtraneousValues: true,
                })
            );
            this.uuid = favorite.uuid || uuids4();
        }
    }
}
