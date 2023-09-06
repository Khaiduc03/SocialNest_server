import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
    NODE_ENV,
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER,
} from 'src/environment';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
      
        return {
            type: 'postgres',
            //url: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
            host: POSTGRES_HOST,
            port: POSTGRES_PORT,
            username: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            ssl:NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
           
        };
    }
}
