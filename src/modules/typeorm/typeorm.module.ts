import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';
import { Image, News, Topic, User } from 'src/entities';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, Image, Topic, News])],
    exports: [TypeOrmModule],
})
export class TypeOrmModule1 {}
