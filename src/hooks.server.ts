import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let pool: Pool;
try {
  // run this once when app starts
  pool = new Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW
  });
  await pool.connect();
  console.log('pg connected...');
} catch(Exception) {
  console.log('Could not connect to database');
}

export async function handle ({event, resolve}) {
  console.log('running handle...')
  event.locals = {
    pool: pool
  };
  const response = await resolve(event);
  return response;
};
