const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.get('/', regionController.getAllRegions);
router.get('/:id/data', regionController.getRegionData);
router.get('/:id/news', regionController.getRegionNews);

module.exports = router;
