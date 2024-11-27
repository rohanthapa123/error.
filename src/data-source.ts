import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { CustomLogger, logger } from '@krezona/common-library';

const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

if(!isTest && !(process.env.DB_PORT_DEVELOPMENT || process.env.DB_PORT)){
    logger.error('Database port not defined in .env file');
    throw new Error('Database port is not loaded from .env.dev');
}
 
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isTest ? 'localhost' : (isProduction ? process.env.DB_HOST : process.env.DB_HOST_DEVELOPMENT),
  port: isTest ? 5433 : (isProduction ? Number(process.env.DB_PORT) : Number(process.env.DB_PORT_DEVELOPMENT)),
  username: isTest ? 'postgres' : (isProduction ? process.env.DB_USERNAME : process.env.DB_USERNAME_DEVELOPMENT),
  password: isTest ? 'postgres' : (isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEVELOPMENT),
  database: isTest ? 'authDB-test' : (isProduction ? process.env.DB_PRODUCTION : process.env.DB_DEVELOPMENT),
  synchronize: isTest ? true : false,
  logging: true,
  entities: ['src/entity/*.ts'],
  migrations: isTest ? ['src/test/migration/*.ts'] : (isProduction ? ['src/migration/production/*.ts'] : ['src/migration/development/*.ts']),
  subscribers: [],
  logger: new CustomLogger(),
});
