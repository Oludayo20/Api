const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [
    {
      open: { type: Boolean, default: false },
      questionText: String,
      questionImage: { type: String, default: '' },
      options: [
        {
          optionText: String,
          optionImage: { type: String, default: '' }
        }
      ],
      answer: { type: String, required: true }
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
