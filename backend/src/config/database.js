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

		CREATE TABLE IF NOT EXISTS pedidos (
			id SERIAL PRIMARY KEY,
			sessao_id VARCHAR(255) NOT NULL,
			cliente_nome VARCHAR(150) NOT NULL,
			whatsapp VARCHAR(30) NOT NULL,
			email VARCHAR(255),
			forma_pagamento VARCHAR(80) NOT NULL,
			endereco TEXT NOT NULL,
			complemento TEXT,
			data_entrega DATE NOT NULL,
			horario VARCHAR(50) NOT NULL,
			observacoes TEXT,
			subtotal NUMERIC(10,2) NOT NULL,
			frete NUMERIC(10,2) NOT NULL DEFAULT 7,
			desconto NUMERIC(10,2) NOT NULL DEFAULT 0,
			total NUMERIC(10,2) NOT NULL,
			status VARCHAR(30) NOT NULL DEFAULT 'Agendado',
			criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS pedido_itens (
			id SERIAL PRIMARY KEY,
			pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
			produto_id INTEGER NOT NULL REFERENCES produtos(id),
			produto_nome VARCHAR(255) NOT NULL,
			quantidade INTEGER NOT NULL CHECK (quantidade > 0),
			preco_unitario NUMERIC(10,2) NOT NULL
		);

		CREATE TABLE IF NOT EXISTS estoque (
			id SERIAL PRIMARY KEY,
			nome VARCHAR(150) NOT NULL,
			categoria VARCHAR(80) NOT NULL,
			quantidade NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
			unidade VARCHAR(20) NOT NULL,
			minimo NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (minimo >= 0),
			validade DATE,
			criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS eventos (
			id SERIAL PRIMARY KEY,
			cliente VARCHAR(150) NOT NULL,
			tipo VARCHAR(80) NOT NULL,
			data DATE NOT NULL,
			horario TIME NOT NULL,
			endereco TEXT NOT NULL,
			convidados INTEGER NOT NULL CHECK (convidados > 0),
			valor NUMERIC(12,2) CHECK (valor IS NULL OR valor >= 0),
			status VARCHAR(30) NOT NULL DEFAULT 'Aguardando',
			criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS pagamento_status VARCHAR(20) NOT NULL DEFAULT 'Pendente';
		ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
		ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS bairro VARCHAR(100);
	`;

	await pool.query(query);
}

module.exports = {
	pool,
	initializeDatabase,
};
