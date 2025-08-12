const express = require('express');
const router = express.Router();
const subAdminController = require('../controllers/subAdminController');

router.get('/', subAdminController.getAllSubAdmins);
router.get('/:id', subAdminController.getSubAdminById);
router.post('/', subAdminController.createSubAdmin);
router.put('/:id', subAdminController.updateSubAdmin);
router.delete('/:id', subAdminController.deleteSubAdmin);

module.exports = router;