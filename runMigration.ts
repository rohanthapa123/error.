import { config } from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : (process.env.NODE_ENV === 'development'? '.env.dev':'.env');
console.log(envFile);
config({ path: envFile });
import { execSync } from 'child_process';

//change the name of migration file authenticationMS-test-v005 before running migration
execSync(`npm run typeorm migration:generate -- -d ./src/data-source ./src/migration/${process.env.NODE_ENV}/authenticationMs-v011`, { stdio: 'inherit' });