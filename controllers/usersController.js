const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('../config/nodemailer');

// @desc Get all users
// @route Get / users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
});

// @desc Create new user
// @route POST / users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Confirm data
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!password || password.length === 6) {
    return res.status(400).json({ message: 'Password is required' });
  }

  // Check for duplicate username
  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();
  const duplicateEmail = await User.findOne({ email })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicateUsername) {
    return res.status(409).json({ message: 'This username already exist' });
  }
  if (duplicateEmail) {
    return res.status(409).json({ message: 'Email is already in use' });
  }

  // Confirmation Code
  const token = jwt.sign({ email: req.body.email }, process.env.COM_SECRET);

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = !role
    ? { username, email, password: hashedPwd, confirmationCode: token }
    : { username, email, password: hashedPwd, confirmationCode: token, role };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    nodemailer.sendConfirmationEmil(
      user.username,
      user.email,
      user.confirmationCode
    );

    // Created
    res.status(201).json({
      message: `New user ${username} is created successful! Please check your email`
    });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  // const user = User.findOne({ confirmationCode: req.params.confirmationCode });
  // if (user) {
  //   user.status == 'Active';
  //   await user.save();
  //   return res.status(200).json({ message: 'User verified' });
  // } else {
  //   console.log('Not saved');
  // }

  User.findOne({
    confirmationCode: req.params.confirmationCode
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      user.status = 'Active';
      user.save((err) => {
        {
          if (err) {
            res
              .status(500)
              .json({ message: 'An Error occurred. Please try again later.' });
            return;
          }
        }
      });
    })
    .catch((err) => console.log('error', err));
});

// @desc Update a user
// @route PATCH / users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, email, password, roles } = req.body;

  // Confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length) {
    return res
      .status(400)
      .json({ message: 'All fields except password are required' });
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check for duplicate username
  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();
  const duplicateEmail = await User.findOne({ email })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicateUsername && duplicateUsername?._is.toString() !== id) {
    return res.status(409).json({ message: 'This username already exist' });
  }
  if (duplicateEmail && duplicateUsername?._is.toString() !== id) {
    return res.status(409).json({ message: 'Email is already in use' });
  }

  user.username = username;
  user.email = email;
  user.roles = roles;

  if (password) {
    // Hashed password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  return res.status(200).json({ message: `${updatedUser.username} Updated` });
});

// @desc Get all users
// @route POST / users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  verifyUser,
  updateUser,
  deleteUser
};
