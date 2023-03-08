const { Department, Student } = require('../models/Attendance');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const attendanceLink = asyncHandler(async (req, res) => {
  const { department } = req.body;

  // Confirm data
  if (!department)
    return res.status(400).json({ message: 'All fields are required' });

  await Department.remove({});
  const parent = new Department({ name: department });
  console.log(parent);

  parent.save((error) => {
    if (!error) {
      const link = `${process.env.BASE_URI}/${department.replace(/\s/g, '')}`;
      res.status(201).json({ link, message: 'Done' });
      console.log(link);
    } else {
      return res.status(400).json(error);
    }
  });
});

const signAttendance = asyncHandler(async (req, res) => {
  const { email, matriculationNum, secretMsg, department, level } = req.body;

  // Confirm data
  if (!email || !matriculationNum || !secretMsg || !department || !level) {
    res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate title
  const duplicateEmail = await Student.findOne({ email })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  const duplicateMatriculationNum = await Student.findOne({ matriculationNum })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  const duplicateSecretMsg = await Student.findOne({ secretMsg })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicateEmail) {
    return res.status(409).json({ message: 'Duplicate Email' });
  }

  if (duplicateMatriculationNum) {
    return res.status(409).json({ message: 'Duplicate Matric Number' });
  }

  if (duplicateSecretMsg) {
    return res.status(409).json({ message: 'Duplicate Secrete Message' });
  }

  const dep = await Department.findOne({ name: department });
  console.log('Department found');

  if (!dep) {
    console.log('Department not found');
    const dep = await Department.create({ name: department });
    console.log(dep);
  }

  const student = new Student({
    email: email,
    matriculationNum: matriculationNum,
    secretMsg: secretMsg,
    level: level,
    department: dep._id
  });

  switch (level) {
    case '100L':
      dep.levelOne.push(student._id);
      await dep.save();
      break;
    case '200L':
      dep.levelTwo.push(student._id);
      await dep.save();
      break;
    case '300L':
      dep.levelThree.push(student._id);
      await dep.save();
      break;
    case '400L':
      dep.levelFour.push(student._id);
      await dep.save();
      break;
    case '500L':
      dep.levelFive.push(student._id);
      await dep.save();
      break;
    default:
      console.log('Level not found');
  }

  student.save((error) => {
    if (!error) {
      res.status(201).json({ message: 'Attendance have been signed' });
    } else {
      return res.status(400).json(error);
    }
  });
});

module.exports = { attendanceLink, signAttendance };
