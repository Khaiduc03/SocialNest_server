import { Expose, plainToClass } from 'class-transformer';
import { Base } from './base';
import { uuids4 } from 'src/utils';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';


@Entity({
    name: Follows.name.toLowerCase(),
    orderBy: {
        uuid: 'ASC',
    },
})

export class Follows extends Base {
    @Expose()
    @ManyToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'follower_uuid', referencedColumnName: 'uuid' })
    follower: User;

    @Expose()
    @ManyToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'following_uuid', referencedColumnName: 'uuid' })
    following: User;
    
    @Expose()
    @Column({ type: 'varchar', length: 300, nullable: false })
    test : string;

    constructor(follows: Partial<Follows>) {
        super();
        if (follows) {
            Object.assign(
                this,
                plainToClass(Follows, follows, {
                    excludeExtraneousValues: true,
                })
            );
            this.uuid = follows.uuid || uuids4();
        }
    }
}
