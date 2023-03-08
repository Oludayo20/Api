// server/models/student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
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
  quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
