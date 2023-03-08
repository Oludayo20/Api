const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
