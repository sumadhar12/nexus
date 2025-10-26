import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const sslEnabled = this.configService.get<string>('DB_SSL') === 'true';
    
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST') || 'localhost',
      port: this.configService.get<number>('DB_PORT') || 3306,
      username: this.configService.get<string>('DB_USERNAME') || 'root',
      password: this.configService.get<string>('DB_PASSWORD') || '',
      database: this.configService.get<string>('DB_NAME') || 'nexus_db',
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      synchronize: this.configService.get<string>('NODE_ENV') === 'development',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    };
  }
}
