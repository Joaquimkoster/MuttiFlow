const Dashboard = require('../models/Dashboard');

async function buscar(req, res) {
  try {
    return res.json(await Dashboard.buscar());
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    return res.status(500).json({ erro: 'Erro ao carregar indicadores' });
  }
}

module.exports = { buscar };
