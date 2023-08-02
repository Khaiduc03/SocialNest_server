import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Expose, plainToClass } from 'class-transformer';
import { uuids4 } from 'src/utils';

@Entity({
    name: Image.name.toLowerCase(),
    orderBy: {
        createdAt: 'ASC',
    },
})
export class Image extends Base {
    @Expose()
    @Column({ type: 'varchar', length: 300, nullable: true, default: null })
    public_id: string;

    @Expose()
    @Column({ type: 'varchar',length:300, nullable: true , default: null})
    url: string;

    @Expose()
    @Column({ type: 'varchar', length:300,nullable: true , default: null})
    secure_url: string;
    
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    constructor(image: Partial<Image>) {
        super();
        if (image) {
            Object.assign(
                this,
                plainToClass(Image, image, {
                    excludeExtraneousValues: true,
                })
            );
            this.uuid = image.uuid || uuids4();
        }
    }
}
