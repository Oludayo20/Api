const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const path = require('path');
const ejs = require('ejs');
const { config } = require('process');
const sendEmail = require('../config/nodemailer');
const { emailConfig } = require('../config/emailConfig');

// @desc Create new user
// @route POST /auth/register
// @access Private
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

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
  const duplicateUsername = await Teacher.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();
  const duplicateEmail = await Teacher.findOne({ email })
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
  const verificationToken = jwt.sign(
    { email: req.body.email },
    process.env.COM_SECRET
  );

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    email,
    password: hashedPwd,
    confirmationCode: verificationToken
  };

  // Create and store new user
  const user = await Teacher.create(userObject);

  const url = `localhost://4000/auth/verify/${verificationToken}`;

  if (user) {
    // ejs.renderFile(
    //   path.join(__dirname, '../views/emails/verify.ejs'),
    //   {
    //     config: config,
    //     title: 'Verify Your Email',
    //     url
    //   },
    //   async (err, data) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       await sendEmail({
    //         to: email,
    //         subject: 'Verify Your Email',
    //         text: data
    //       });
    //     }
    //   }
    // );
    // Created
    res.status(201).json({
      message: `New user ${username} is created successful! Please check your email`
    });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

// @desc Create new user
// @route GET /auth/confirm/:confirmationCode
// @access Private
const verifyUser = asyncHandler(async (req, res) => {
  // const user = Teacher.findOne({ confirmationCode: req.params.confirmationCode });
  // if (user) {
  //   user.status == 'Active';
  //   await user.save();
  //   return res.status(200).json({ message: 'Teacher verified' });
  // } else {
  //   console.log('Not saved');
  // }

  Teacher.findOne({
    confirmationCode: req.params.confirmationCode
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Teacher not found.' });
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

// @desc Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundUser =
    // (await Teacher.findOne({ username }).exec()) ||
    await Teacher.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(400).json({ message: 'Teacher not found' });
  }

  if (foundUser.verified == false) {
    return res.status(401).send({
      message: 'Pending Account. Please Verify Your Email!'
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match)
    return res.status(401).json({ message: 'Password is not correct' });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        username: foundUser.username
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '10m' }
  );

  const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1m'
  });

  //Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  });

  // Send accessToken containing user data
  res.status(201).json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await Teacher.findOne({
        username: decoded.username
      }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            role: foundUser.role
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    })
  );
};

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
  const user = await Teacher.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'Teacher not found' });
  }

  // Check for duplicate username
  const duplicateUsername = await Teacher.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();
  const duplicateEmail = await Teacher.findOne({ email })
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

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

module.exports = {
  register,
  verifyUser,
  login,
  refresh,
  updateUser,
  logout
};
