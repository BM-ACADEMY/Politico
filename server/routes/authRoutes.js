// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // Public routes
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);

// // Protected route example
// router.get('/profile', authController.getProfile);

// module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user-info', authMiddleware, authController.getUserInfo);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;