const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const databaseHost = process.env.DB_HOST === 'localhost'
	? '127.0.0.1'
	: process.env.DB_HOST || '127.0.0.1';

const pool = new Pool({
	host: databaseHost,
	port: Number(process.env.DB_PORT) || 5432,
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || '8846',
	database: process.env.DB_NAME || 'muttiflow',
	connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS) || 5000,
	idleTimeoutMillis: 30000,
});

async function initializeDatabase() {
	const schemaPath = path.resolve(__dirname, '../database/init.sql');
	const schema = fs.readFileSync(schemaPath, 'utf8');
	await pool.query(schema);
}

module.exports = {
	pool,
	initializeDatabase,
};
