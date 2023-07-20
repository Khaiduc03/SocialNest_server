import { Admin, BeforeInsert, Column, Entity } from 'typeorm';
import { Base } from './base';
import { Expose, plainToClass } from 'class-transformer';
import { TypeRole, UserRole } from './types';
import { hashPassword } from 'src/utils';

@Entity({
    name: 'users',
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
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    roles: UserRole;

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

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await hashPassword(this.password);
        }
    }

    
  

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
