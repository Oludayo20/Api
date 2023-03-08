// server/controllers/answerController.js

const Answer = require('../models/answer');

// Create a new answer
exports.createAnswer = async (req, res) => {
  try {
    const answer = new Answer({
      student: req.body.student,
      question: req.body.question,
      option: req.body.option
    });

    await answer.save();

    res.status(201).json({ message: 'Answer created successfully', answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating answer' });
  }
};

// Get a list of all answers for a student
exports.getAnswersForStudent = async (req, res) => {
  try {
    const answers = await Answer.find({ student: req.params.studentId });

    res.json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving answers' });
  }
};

// Get a list of all answers for a quiz
exports.getAnswersForQuiz = async (req, res) => {
  try {
    const answers = await Answer.find({ quiz: req.params.quizId });

    res.json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving answers' });
  }
};

// Get a single answer by ID
exports.getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving answer' });
  }
};

// Update an answer by ID
exports.updateAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      {
        student: req.body.student,
        question: req.body.question,
        option: req.body.option
      },
      { new: true }
    );

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.json({ message: 'Answer updated successfully', answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating answer' });
  }
};

// Delete an answer by ID
exports.deleteAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.json({ message: 'Answer deleted successfully', answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting answer' });
  }
};
