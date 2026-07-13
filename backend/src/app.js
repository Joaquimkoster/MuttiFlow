const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const { pool } = require('./config/database');
const carrinhoRoutes = require('./routes/carrinhosRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', async (req, res) => {
	try {
		await pool.query('SELECT 1');
		return res.json({ status: 'ok', database: 'connected' });
	} catch {
		return res.status(503).json({ status: 'error', database: 'unavailable' });
	}
});

app.use('/auth', authRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/eventos', eventoRoutes);
app.use('/dashboard', dashboardRoutes);

app.use((req, res) => {
	res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;
