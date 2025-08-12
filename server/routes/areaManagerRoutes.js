const express = require('express');
const router = express.Router();
const areaManagerController = require('../controllers/areaManagerController');

router.get('/', areaManagerController.getAllAreaManagers);
router.get('/:id', areaManagerController.getAreaManagerById);
router.post('/', areaManagerController.createAreaManager);
router.put('/:id', areaManagerController.updateAreaManager);
router.delete('/:id', areaManagerController.deleteAreaManager);

module.exports = router;