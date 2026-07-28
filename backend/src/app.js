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

const origensPermitidas = [
	process.env.CLIENTE_URL || 'http://localhost:5173',
	process.env.ADMIN_URL || 'http://localhost:5174',
].filter(Boolean);

function origemLocalDeDesenvolvimento(origin) {
	if (process.env.NODE_ENV === 'production') return false;
	return /^http:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}):(5173|5174)$/.test(origin);
}

app.use(helmet());
app.use(cors({
	origin(origin, callback) {
		if (!origin || origensPermitidas.includes(origin) || origemLocalDeDesenvolvimento(origin)) return callback(null, true);
		const error = new Error('Origem não permitida pelo CORS.');
		error.status = 403;
		return callback(error);
	},
	credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '100kb' }));

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
	res.status(err.status || 500).json({ erro: err.status === 403 ? err.message : 'Erro interno do servidor.' });
});

module.exports = app;
