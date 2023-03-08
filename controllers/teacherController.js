const Teacher = require('../models/Teacher');

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    await teacher.save();

    res.status(201).json({ message: 'Teacher created successfully', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating teacher' });
  }
};

// Get a list of all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving teachers' });
  }
};

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving teacher' });
  }
};

// Update a teacher by ID
exports.updateTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher updated successfully', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating teacher' });
  }
};

// Delete a teacher by ID
exports.deleteTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting teacher' });
  }
};
