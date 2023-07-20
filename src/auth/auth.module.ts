import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from 'src/configs';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CacheModule.registerAsync({
            useClass: CacheConfigService,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
