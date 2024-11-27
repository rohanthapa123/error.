import { config } from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : (process.env.NODE_ENV === 'development'? '.env.dev':'.env');
console.log(envFile);
config({ path: envFile });
import { execSync } from 'child_process';
execSync(`npm run typeorm migration:run -- -d ./src/data-source`, { stdio: 'inherit' });