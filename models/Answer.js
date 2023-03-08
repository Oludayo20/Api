const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz.questions'
      },
      answer: String
    }
  ]
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
