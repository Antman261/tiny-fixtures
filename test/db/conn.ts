import {Pool} from 'pg';

export const pool = new Pool({
  host: 'localhost',
  password: 'postgres',
  user: 'postgres',
});
