import { Expose, plainToClass } from 'class-transformer';
import { Base } from './base';
import { uuids4 } from 'src/utils';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    
    OneToOne,
} from 'typeorm';
import { News } from './news.entity';
import { Comment } from './comment.entity';

@Entity({
    name: 're_comment',
    orderBy: {
        uuid: 'ASC',
    },
})
export class Re_comment extends Base {
    @Expose()
    @OneToOne(() => Comment, (comment) => comment.uuid)
    @JoinColumn({ name: 'comment_uuid', referencedColumnName: 'uuid' })
    comment_uuid: Comment;

    @Expose()
    @ManyToOne(() => News, (news) => news.uuid)
    @JoinColumn({ name: 'news_uuid', referencedColumnName: 'uuid' })
    news_uuid: News;

    @Expose()
    @Column({ type: 'text', default: '' })
    body: string;

    constructor(re_comment: Partial<Re_comment>) {
        super();
        if (re_comment) {
            Object.assign(
                this,
                plainToClass(Re_comment, re_comment, {
                    excludeExtraneousValues: true,
                })
            );
            this.uuid = re_comment.uuid || uuids4();
        }
    }
}
