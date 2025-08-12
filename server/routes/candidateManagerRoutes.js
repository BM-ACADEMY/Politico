const express = require('express');
const router = express.Router();
const candidateManagerController = require('../controllers/candidateManagerController');

router.get('/', candidateManagerController.getAllCandidateManagers);
router.get('/:id', candidateManagerController.getCandidateManagerById);
router.post('/', candidateManagerController.createCandidateManager);
router.put('/:id', candidateManagerController.updateCandidateManager);
router.delete('/:id', candidateManagerController.deleteCandidateManager);

module.exports = router;