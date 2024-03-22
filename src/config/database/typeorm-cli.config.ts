import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default new DataSource({
	type: 'postgres',
	host: 'postgres',
	database: configService.get<string>('DB_NAME'),
	username: configService.get<string>('DB_USERNAME'),
	password: configService.get<string>('DB_PASSWORD'),
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/**/migrations/*{.ts,.js}'],
});
