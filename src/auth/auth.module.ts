import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image, User } from 'src/entities';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService, JWTService } from 'src/configs';
import { JwtService } from '@nestjs/jwt';
import { CloudModule, CloudService, ImageService } from 'src/modules';

@Module({
    imports: [
        TypeOrmModule.forFeature([User,Image]),
      
    ],
    controllers: [AuthController],
    providers: [AuthService,JwtService,JWTService,ImageService,CloudService],
})
export class AuthModule {}
