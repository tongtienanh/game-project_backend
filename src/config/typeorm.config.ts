import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User, UserRole, RolePermission, Role, Permission, ModulePermission } from '../database/entities';
import 'dotenv/config';

export const typeormAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<any> => {
    return {
      type: 'mysql',
      host: 'localhost',
      port: process.env.DB_PORT,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, UserRole, RolePermission, Role, Permission, ModulePermission],
      synchronize: false,
      logging: true,
      migrations: ['dist/databases/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/databases/migrations',
      },
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    };
  },
};

export const typeOrmConfig = {
  type: 'mysql',
  host: 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrations: ['dist/databases/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/databases/migrations',
  },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};
