import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService, TypeOrmService } from './configs';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

import {
    BookmarkModule,
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
    ],
    controllers: [],
    providers: [
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
        // {
        //     provide: APP_GUARD,
        //     useClass: RolesGuard,
        // },
    ],
    exports: [
        CacheModule.registerAsync({
            useClass: CacheConfigService,
        }),
    ],
})
export class AppModule {}
