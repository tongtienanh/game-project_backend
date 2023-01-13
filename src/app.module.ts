import {CommandModule} from './commands/command.module';
import {CommonModule} from './modules/common/common.module';
import {Module, ValidationPipe} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppService} from './app.service';
import {typeormAsyncConfig} from 'src/config/typeorm.config';
import {ConfigModule} from '@nestjs/config';
import {APP_FILTER, APP_PIPE} from '@nestjs/core';
import {AllExceptionFilter} from './common/filter/exceptions.filter';
import {UsersModule} from './modules/users/users.module';
import {AuthModule} from './modules/auth/auth.module';
import {GameModule} from "./modules/game/game.module";
import {AclModule} from "./modules/acl/acl.module";

@Module({
    imports: [
        CommandModule,
        CommonModule,
        CommonModule,
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync(typeormAsyncConfig),
        UsersModule,
        AuthModule,
        GameModule,
        AclModule,
    ],
    controllers: [],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({transform: true}),
        },
    ],
})
export class AppModule {
}
