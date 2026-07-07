const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const { initializeDatabase } = require('./config/database');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

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
