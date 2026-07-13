const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const autenticar = require('../middlewares/auth');

const router = express.Router();
router.get('/', autenticar, dashboardController.buscar);

module.exports = router;
