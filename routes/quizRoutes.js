const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.route('/').post(quizController.createQuiz);

module.exports = router;
