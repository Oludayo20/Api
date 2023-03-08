const Question = require('../models/question');

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const question = new Question({
      text: req.body.text,
      options: req.body.options,
      correctOption: req.body.correctOption,
      quiz: req.body.quiz
    });

    await question.save();

    res
      .status(201)
      .json({ message: 'Question created successfully', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating question' });
  }
};

// Get a list of all questions for a quiz
exports.getQuestionsForQuiz = async (req, res) => {
  try {
    const questions = await Question.find({ quiz: req.params.quizId });

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving questions' });
  }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving question' });
  }
};

// Update a question by ID
exports.updateQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        options: req.body.options,
        correctOption: req.body.correctOption,
        quiz: req.body.quiz
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating question' });
  }
};

// Delete a question by ID
exports.deleteQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting question' });
  }
};
