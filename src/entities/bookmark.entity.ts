import { Expose, plainToClass } from 'class-transformer';
import { Base } from './base';
import { uuids4 } from 'src/utils';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
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
  @OneToOne(() => User, (user) => user.uuid)
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
  user_uuid: User;

  @Expose()
  @OneToMany(() => News, (news) => news.uuid)
  @JoinColumn()
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
