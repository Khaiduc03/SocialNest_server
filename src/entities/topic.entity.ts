import { Expose, plainToClass } from 'class-transformer';
import { Base } from './base';
import { Column, Entity } from 'typeorm';
import { User } from './user.entity';
import { uuids4 } from 'src/utils';

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
