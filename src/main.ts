import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NODE_ENV, PORT } from './environment';
// import { LoggerMiddleware, TimeoutInterceptor } from './core';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(),
    });

    app.getHttpAdapter();

    // NODE_ENV !== 'testing' && app.use(LoggerMiddleware);

    // app.useGlobalInterceptors(new TimeoutInterceptor());

    app.useGlobalPipes(new ValidationPipe());

    app.enableShutdownHooks();

    await app.listen(PORT);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap().catch((error) => {
    Logger.error(`Server Can Not Start. Error: ${error.message}`, false);
    process.exit(1);
});
