import {Pool} from 'pg';

export const pool = new Pool({
  host: process.env.DatabaseHost || 'localhost',
  password: 'postgres',
  user: 'postgres',
});
