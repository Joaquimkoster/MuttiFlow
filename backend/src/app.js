const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const { initializeDatabase } = require('./config/database');
const carrinhoRoutes = require('./routes/carrinhosRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const pedidosRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/eventos', eventoRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/pedido', pedidosRoutes);

app.use((req, res) => {
	res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ erro: 'Erro interno do servidor.' });
});

initializeDatabase()
	.then(() => console.log('Banco pronto para uso.'))
	.catch((error) => console.error('Erro ao inicializar banco:', error));

module.exports = app;
