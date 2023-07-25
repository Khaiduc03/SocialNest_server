import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image, User } from 'src/entities';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { JWTService } from 'src/configs';
import { ImageService } from '../image';
import { CloudService } from '../cloud';

@Module({
    imports: [TypeOrmModule.forFeature([User,Image])],
    providers: [UserService,JWTService,JwtService, ImageService,CloudService],
    controllers: [UserController],
})
export class UserModule {}
