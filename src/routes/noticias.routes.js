const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticias.controller');

router.get('/buscar', noticiasController.buscar);

module.exports = router;
