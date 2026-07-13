const app = require('./app');
const { initializeDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
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
