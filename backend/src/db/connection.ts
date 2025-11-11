import { Pool } from 'pg';
import { config } from './config.js';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};

// Test connection
pool.on('connect', () => {
  console.log('✓ Database connection pool established');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default db;
