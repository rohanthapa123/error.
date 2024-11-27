import { Client } from 'pg';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { testLogger } from '@krezona/common-library';


// Environment variables
const DB_NAME = 'authDB-test';
const DB_USER = 'postgres';
const DB_PASSWORD = 'postgres';
const DB_HOST = 'localhost';
const DB_PORT = 5433;
const MIGRATION_DIR = path.join(__dirname, 'migration');

// Create the database
async function createDatabase() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    await client.connect();
    testLogger.info(`Dropping database ${DB_NAME} if it exists...`);
    await client.query(`DROP DATABASE IF EXISTS "${DB_NAME}";`);
    testLogger.info(`Creating database ${DB_NAME}...`);
    await client.query(`CREATE DATABASE "${DB_NAME}";`);
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    testLogger.info('UUID-OSSP extension created or already exists');
  } catch (err) {
    testLogger.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Clean the migration directory
async function cleanMigrationDirectory() {
  testLogger.info(`Cleaning migration directory: ${MIGRATION_DIR}`);
  return new Promise((resolve, reject) => {
    fs.readdir(MIGRATION_DIR, (err, files) => {
      if (err) {
        testLogger.error('Error reading migration directory:', err);
        return reject(err);
      }
      const unlinkPromises = files.map(file => 
        new Promise<void>((resolve, reject) => {
          fs.unlink(path.join(MIGRATION_DIR, file), err => {
            if (err) {
              testLogger.error('Error deleting file:', err);
              return reject(err);
            }
            resolve();
          });
        })
      );
      Promise.all(unlinkPromises).then(resolve).catch(reject);
    });
  });
}


// Generate the migration
function generateMigration() {
  console.log('Generating migration...');
  try {
    execSync(`npm run typeorm migration:generate -- -d ./src/data-source ./src/test/migration/migrationfile`, { stdio: 'inherit' });
  } catch (error) {
    testLogger.error('Error generating migration:', error);
    process.exit(1);
  }
}

function runMigrations() {
  try {
    execSync('npm run typeorm migration:run -- -d ./src/data-source', { stdio: 'inherit' });
    testLogger.info('Migration command executed successfully');
  } catch (error) {
    testLogger.error('Error running migration:', error);
    throw error;
  }
}

// Main function
async function main() {
  await createDatabase();
  await cleanMigrationDirectory();
  generateMigration();
  runMigrations();

  testLogger.info('Setup completed.');
}

main();
