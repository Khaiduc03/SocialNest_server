import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService, TypeOrmService } from './configs';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './core/guards';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmService,
        }),

        CacheModule.registerAsync({
            useClass: CacheConfigService
        }),
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
          },
    ],
    exports: [
      CacheModule.registerAsync({
        useClass: CacheConfigService
    }),
    ]
})
export class AppModule {


}
