const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/register').post(authController.register);
router.route('/confirm/:confirmationCode').get(authController.verifyUser);
router.route('/login').post(authController.login);
router.route('/refresh').get(authController.refresh);
router.route('/update').patch(authController.logout);
router.route('/logout').post(authController.logout);

module.exports = router;
