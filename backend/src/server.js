const app = require('./app');
const { initializeDatabase } = require('./config/database');
const { obterJwtSecret } = require('./config/jwt');

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
		obterJwtSecret();
		if (process.env.NODE_ENV === 'production' && (!process.env.CLIENTE_URL || !process.env.ADMIN_URL)) {
			throw new Error('CLIENTE_URL e ADMIN_URL são obrigatórias em produção.');
		}
		await initializeDatabase();
		console.log('Banco pronto para uso.');
		app.listen(PORT, () => {
			console.log(`Servidor rodando na porta ${PORT}`);
		});
	} catch (error) {
		console.error('Não foi possível iniciar o backend: banco de dados indisponível.', error.message);
		process.exitCode = 1;
	}
}

startServer();
