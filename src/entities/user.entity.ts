import {
    Admin,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Base } from './base';
import { Expose, plainToClass } from 'class-transformer';
import { UserRole } from './types';
import { Image } from './image.entity';

@Entity({
    name: User.name.toLowerCase(),
    orderBy: {
        uuid: 'ASC',
    },
})
export class User extends Base {
    @Expose()
    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;

    @Expose()
    @Column({ type: 'varchar', length: 255, default: '' })
    password: string;

    @Expose()
    @Column({ type: 'varchar', length: 255, unique: true ,default: null})
    email: string;

    @Expose()
    @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
    roles: UserRole;

    @Expose()
    @Column({ type: 'varchar', length: 255, default: '' })
    fullname: string;

    @Expose()
    @Column({ type: 'varchar', length: 255, nullable: true })
    phoneNumber: string;

    @Expose()
    @Column({ type: 'text', nullable: true })
    summary: string;

    @Expose()
    @Column({ type: 'boolean', default: 0 })
    gender: boolean;

    @Expose()
    @Column({ type: 'bool', default: false })
    status: boolean;

    @Expose()
    @Column({ type: 'varchar', default: '' })
    device_token: string;

    @Expose()
    @OneToOne(() => Image, (image) => image.uuid)
    @JoinColumn({ name: 'avatar_uuid', referencedColumnName: 'uuid' })
    avatar: Image;

    constructor(user: Partial<User>) {
        super(); // call constructor of BaseEntity
        if (user) {
            Object.assign(
                this,
                plainToClass(User, user, { excludeExtraneousValues: true })
            );
            this.uuid = user.uuid;
        }
    }
}