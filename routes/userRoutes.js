const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router
  .route('/')
  .get()
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete();

router.route('/confirm/:confirmationCode').get(usersController.verifyUser);

module.exports = router;
