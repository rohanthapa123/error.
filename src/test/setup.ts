import { config } from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : (process.env.NODE_ENV === 'development'? '.env.dev':'.env');
console.log(envFile);
config({ path: envFile });

import { AppDataSource } from '../data-source';

let skipSetup = false;

export const shouldSkipSetup = () => skipSetup;

export const setSkipSetup = (value: boolean) => {
  skipSetup = value;
};

async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error creating UUID-OSSP extension:', error);
    throw error;
  }
}

async function truncateAllTables() {
  const connection = AppDataSource;
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE ${entity.tableName} RESTART IDENTITY CASCADE`);
  }
}

beforeAll(async () => {
  await initializeDatabase();
}); // Increase the timeout to 30 seconds



// Wrap each test in a transaction and rollback to ensure clean state
beforeEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }
});

export { AppDataSource as dataSource };
