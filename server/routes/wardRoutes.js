const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');

router.get('/', wardController.getAllWards);
router.get('/:id', wardController.getWardById);
router.post('/', wardController.createWard);
router.put('/:id', wardController.updateWard);
router.delete('/:id', wardController.deleteWard);

module.exports = router;