const Student = require('../models/student');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      grade: req.body.grade
    });

    await student.save();

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating student' });
  }
};

// Get a list of all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving students' });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving student' });
  }
};

// Update a student by ID
exports.updateStudentById = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        grade: req.body.grade
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating student' });
  }
};

// Delete a student by ID
exports.deleteStudentById = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting student' });
  }
};
