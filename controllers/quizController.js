const Quiz = require('../models/Quiz');
const Teacher = require('../models/Teacher');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  const { title, description, questions, answer, createdBy } = req.body;

  const teacher = await Teacher.findById(createdBy);

  const quiz = new Quiz({
    title,
    description,
    questions,
    answer,
    createdBy
  });

  console.log(quiz);

  if (teacher) {
    await quiz.save().then((docs) => {
      Teacher.updateOne(
        { _id: quiz.createdBy },
        { $push: { quizzes: docs._id } }
      )
        .then(() => {
          res
            .status(201)
            .json({ message: 'Quiz created and Linked successfully', quiz });
        })
        .catch((error) =>
          res.status(500).json({ message: 'Error creating quiz' })
        );
    });
  } else {
    res.status(500).json({ message: 'Teacher not found' });
  }
};

// Get a list of all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving quizzes' });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
};

// Update a quiz by ID
exports.updateQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        teacher: req.body.teacher,
        questions: req.body.questions
      },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating quiz' });
  }
};

// Delete a quiz by ID
exports.deleteQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting quiz' });
  }
};
