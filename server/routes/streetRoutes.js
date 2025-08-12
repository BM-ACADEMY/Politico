const express = require('express');
const router = express.Router();
const streetController = require('../controllers/streetController');

router.get('/', streetController.getAllStreets);
router.get('/:id', streetController.getStreetById);
router.post('/', streetController.createStreet);
router.put('/:id', streetController.updateStreet);
router.delete('/:id', streetController.deleteStreet);

module.exports = router;