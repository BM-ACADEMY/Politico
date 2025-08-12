const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Protect all role routes - only 'admin' role allowed
// router.use(authenticate);
// router.use(authorizeRoles('admin'));

// CRUD routes
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
