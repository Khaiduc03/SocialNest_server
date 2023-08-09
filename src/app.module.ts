import { Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CacheConfigService, TypeOrmService } from './configs';

import {
    BookmarkModule,
    CloudModule,
    CommentModule,
    FavoriteModule,
    FollowsModule,
    ImageModule,
    NewsModule,
    ReCommentModule,
    TopicModule,
    UserModule,
} from './modules';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmService,
        }),

        CacheModule.registerAsync({
            useClass: CacheConfigService,
        }),

        AuthModule,

        UserModule,

        ImageModule,

        FollowsModule,

        NewsModule,

        TopicModule,

        BookmarkModule,

        CommentModule,

        ReCommentModule,

        FavoriteModule,

        CloudModule,
    ],
    controllers: [],
    providers: [],
    exports: [
        CacheModule.registerAsync({
            useClass: CacheConfigService,
        }),
    ],
})
export class AppModule {}
