const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
	host: process.env.DB_HOST || '127.0.0.1',
	port: Number(process.env.DB_PORT) || 5432,
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || '8846',
	database: process.env.DB_NAME || 'muttiflow',
});

async function initializeDatabase() {
	const query = `
		CREATE TABLE IF NOT EXISTS usuarios (
			id SERIAL PRIMARY KEY,
			nome VARCHAR(100) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			senha VARCHAR(255) NOT NULL,
			criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`;

	await pool.query(query);
}

module.exports = {
	pool,
	initializeDatabase,
};
